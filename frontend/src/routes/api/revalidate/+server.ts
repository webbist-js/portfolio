import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { BYPASS_TOKEN } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { getArticles, getFixPages, getProjects } from '$lib/strapi';
import {
	isAuthorized,
	mapWithLimit,
	needsSlugs,
	pathsFor,
	withDataPaths,
	type RevalidateEntry,
	type SlugLists
} from '$lib/server/revalidate';
import type { RequestHandler } from './$types';

const MODEL_RE = /^[a-z][a-z0-9-]{0,40}$/;
/** Ceiling on one purge, so a `global` change can never run unbounded. */
const PATH_CAP = 500;
/** Concurrent re-renders; each one makes several Strapi calls of its own. */
const CONCURRENCY = 6;
/** A single hung re-render must not eat the whole function's budget. */
const PURGE_TIMEOUT_MS = 15_000;
// Strapi UID alphabet: letters, digits, "-", "_", ".", "~" — nothing that can
// change the path structure.
const SLUG_RE = /^[a-z0-9][a-z0-9._~-]{0,120}$/;

function parseEntries(body: unknown): RevalidateEntry[] {
	const raw = (body as { entries?: unknown })?.entries;
	if (!Array.isArray(raw)) return [];
	return raw.flatMap((e) => {
		const model = (e as { model?: unknown })?.model;
		const slug = (e as { slug?: unknown })?.slug;
		if (typeof model !== 'string' || !MODEL_RE.test(model)) return [];
		return [{ model, slug: typeof slug === 'string' && SLUG_RE.test(slug) ? slug : undefined }];
	});
}

/** Strapi calls this after publish/unpublish/delete; we purge the ISR
 * cache for every page that can show the changed content.
 *
 * The fan-out deliberately uses the platform `fetch`, not SvelteKit's
 * `event.fetch`: the latter resolves same-origin URLs in-process, so the
 * revalidate header would never reach Vercel's edge. */
export const POST: RequestHandler = async ({ request, fetch: cmsFetch }) => {
	const secret = env.REVALIDATE_SECRET;
	if (!secret) error(503, 'Revalidation is not configured');
	if (!isAuthorized(request.headers.get('authorization'), secret)) error(401, 'Unauthorized');

	let entries: RevalidateEntry[];
	try {
		entries = parseEntries(await request.json());
	} catch {
		error(400, 'Body must be JSON');
	}
	if (!entries.length) error(400, 'No valid entries');

	const failed: string[] = [];
	let slugs: SlugLists = { projects: [], articles: [], fixPages: [] };
	if (needsSlugs(entries)) {
		// The getters throw when the CMS is unreachable. Without slugs we can
		// still purge the index pages, so degrade rather than abandon the purge.
		try {
			const [projects, articles, fixPages] = await Promise.all([
				getProjects(cmsFetch),
				getArticles(cmsFetch),
				getFixPages(cmsFetch)
			]);
			slugs = {
				projects: (projects ?? []).map((p) => p.slug),
				articles: (articles ?? []).map((a) => a.slug),
				fixPages: (fixPages ?? []).map((f) => f.slug)
			};
		} catch (err) {
			failed.push('slug-lookup');
			console.warn(`revalidate: slug lookup failed — ${(err as Error).message}`);
		}
	}

	const wanted = withDataPaths(pathsFor(entries, slugs));
	const paths = wanted.slice(0, PATH_CAP);
	if (wanted.length > paths.length) {
		console.warn(
			`revalidate: ${wanted.length} paths exceeds the ${PATH_CAP} cap — ` +
				`${wanted.length - paths.length} will only refresh on expiry`
		);
	}

	const results = await mapWithLimit(paths, CONCURRENCY, async (path) => {
		const res = await globalThis.fetch(new URL(path, PUBLIC_SITE_URL), {
			headers: { 'x-prerender-revalidate': BYPASS_TOKEN },
			signal: AbortSignal.timeout(PURGE_TIMEOUT_MS)
		});
		// A purged page that no longer exists answers 404, which Vercel caches
		// in place of the old entry — that is a successful eviction.
		if (!res.ok && res.status !== 404) throw new Error(`${res.status}`);
	});

	const revalidated: string[] = [];
	results.forEach((r, i) => (r.status === 'fulfilled' ? revalidated : failed).push(paths[i]));
	const log = failed.length ? console.warn : console.info;
	log(`revalidate: ${revalidated.length} ok, ${failed.length} failed`);
	return json({ revalidated, failed });
};
