import { timingSafeEqual } from 'node:crypto';

export type RevalidateEntry = { model: string; slug?: string };

export interface SlugLists {
	projects: string[];
	articles: string[];
	fixPages: string[];
}

const INDEX_PAGES = ['/', '/work', '/services', '/writing', '/fixes', '/about'];
const SLUG_MODELS = new Set([
	'global',
	'project',
	'article',
	'topic',
	'service',
	'fix-page',
	'fix-category'
]);
const SERVICES_MODELS = new Set(['service', 'process-phase', 'faq', 'testimonial']);
const ABOUT_MODELS = new Set(['experience', 'principle', 'book']);

/** Which ISR pages a set of CMS changes can affect (see spec table). */
export function pathsFor(entries: RevalidateEntry[], slugs: SlugLists): string[] {
	const out = new Set<string>();
	const add = (paths: string[]) => paths.forEach((p) => out.add(p));
	const work = slugs.projects.map((s) => `/work/${s}`);
	const writing = slugs.articles.map((s) => `/writing/${s}`);
	const fixes = slugs.fixPages.map((s) => `/fixes/${s}`);

	for (const { model, slug } of entries) {
		if (model === 'global') add([...INDEX_PAGES, ...work, ...writing, ...fixes]);
		else if (model === 'homepage') add(['/']);
		else if (model === 'project') add(['/', '/work', ...work, ...(slug ? [`/work/${slug}`] : [])]);
		else if (model === 'article' || model === 'topic')
			add([
				'/',
				'/writing',
				...writing,
				...(slug && model === 'article' ? [`/writing/${slug}`] : [])
			]);
		else if (model === 'fix-page') add(['/fixes', ...(slug ? [`/fixes/${slug}`] : fixes)]);
		else if (model === 'fix-category') add(['/fixes', ...fixes]);
		else if (model === 'fixes-hub') add(['/fixes']);
		else if (SERVICES_MODELS.has(model)) {
			add(['/', '/services']);
			// Service name/code render in the CTA band on every fix page.
			if (model === 'service') add(['/fixes', ...fixes]);
		} else if (ABOUT_MODELS.has(model)) add(['/about']);
		else if (model === 'activity') add(['/', '/about']);
	}
	return [...out];
}

export const needsSlugs = (entries: RevalidateEntry[]) =>
	entries.some((e) => SLUG_MODELS.has(e.model));

/** Each page has a sibling `__data.json` entry in the ISR cache. */
export function withDataPaths(paths: string[], cap = 200): string[] {
	const out = new Set<string>();
	for (const p of paths) {
		out.add(p);
		out.add(p === '/' ? '/__data.json' : `${p}/__data.json`);
	}
	return [...out].slice(0, cap);
}

export function isAuthorized(header: string | null, secret: string): boolean {
	if (!header?.startsWith('Bearer ')) return false;
	const given = Buffer.from(header.slice(7));
	const expected = Buffer.from(secret);
	return given.length === expected.length && timingSafeEqual(given, expected);
}
