import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { BYPASS_TOKEN } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { getArticles, getProjects } from '$lib/strapi';
import {
	isAuthorized,
	needsSlugs,
	pathsFor,
	withDataPaths,
	type RevalidateEntry,
	type SlugLists
} from '$lib/server/revalidate';
import type { RequestHandler } from './$types';

const MODEL_RE = /^[a-z][a-z0-9-]{0,40}$/;

function parseEntries(body: unknown): RevalidateEntry[] {
	const raw = (body as { entries?: unknown })?.entries;
	if (!Array.isArray(raw)) return [];
	return raw.flatMap((e) => {
		const model = (e as { model?: unknown })?.model;
		const slug = (e as { slug?: unknown })?.slug;
		if (typeof model !== 'string' || !MODEL_RE.test(model)) return [];
		return [{ model, slug: typeof slug === 'string' ? slug : undefined }];
	});
}

/** Strapi calls this after publish/unpublish/delete; we purge the ISR
 * cache for every page that can show the changed content. */
export const POST: RequestHandler = async ({ request, fetch }) => {
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
	let slugs: SlugLists = { projects: [], articles: [] };
	if (needsSlugs(entries)) {
		const [projects, articles] = await Promise.all([getProjects(fetch), getArticles(fetch)]);
		if (!projects || !articles) failed.push('slug-lookup');
		slugs = {
			projects: (projects ?? []).map((p) => p.slug),
			articles: (articles ?? []).map((a) => a.slug)
		};
	}

	const paths = withDataPaths(pathsFor(entries, slugs));
	const results = await Promise.allSettled(
		paths.map(async (path) => {
			const res = await fetch(new URL(path, PUBLIC_SITE_URL), {
				headers: { 'x-prerender-revalidate': BYPASS_TOKEN }
			});
			if (!res.ok && res.status !== 404) throw new Error(`${res.status}`);
		})
	);

	const revalidated: string[] = [];
	results.forEach((r, i) => (r.status === 'fulfilled' ? revalidated : failed).push(paths[i]));
	console.info(`revalidate: ${revalidated.length} ok, ${failed.length} failed`, entries);
	return json({ revalidated, failed });
};
