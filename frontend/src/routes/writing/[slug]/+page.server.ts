import { error, redirect } from '@sveltejs/kit';
import { getArticle, getArticles } from '$lib/strapi';
import { isr } from '$lib/server/isr';
import type { PageServerLoad } from './$types';

export const config = isr();

export const load: PageServerLoad = async ({ fetch, params }) => {
	const [article, articles] = await Promise.all([
		getArticle(fetch, params.slug),
		getArticles(fetch)
	]);
	if (!article) error(404, 'Article not found');
	// Vendor-published pieces canonically live on the publisher's site.
	if (article.externalUrl) redirect(308, article.externalUrl);

	const list = articles ?? [];
	const idx = list.findIndex((a) => a.slug === article.slug);
	const next = list.length > 1 && idx >= 0 ? list[(idx + 1) % list.length] : null;

	return { article, next };
};
