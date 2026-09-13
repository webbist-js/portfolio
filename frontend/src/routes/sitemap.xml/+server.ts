import { PUBLIC_SITE_URL } from '$env/static/public';
import { getArticles, getProjects } from '$lib/strapi';
import type { RequestHandler } from './$types';

export const prerender = false;

const STATIC_PATHS = ['/', '/work', '/services', '/writing', '/about'];

const entry = (path: string, lastmod?: string) =>
	`<url><loc>${new URL(path, PUBLIC_SITE_URL)}</loc>${
		lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''
	}</url>`;

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	const [projects, articles] = await Promise.all([getProjects(fetch), getArticles(fetch)]);

	const urls = [
		...STATIC_PATHS.map((p) => entry(p)),
		...(projects ?? []).map((p) => entry(`/work/${p.slug}`, p.updatedAt)),
		// Externally published articles live on their publisher's domain.
		...(articles ?? [])
			.filter((a) => !a.externalUrl)
			.map((a) => entry(`/writing/${a.slug}`, a.updatedAt ?? a.date))
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;
	setHeaders({ 'content-type': 'application/xml', 'cache-control': 'max-age=3600' });
	return new Response(xml);
};
