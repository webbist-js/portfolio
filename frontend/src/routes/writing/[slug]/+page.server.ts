import { error } from '@sveltejs/kit';
import { getArticle, getArticles } from '$lib/strapi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const [article, articles] = await Promise.all([
		getArticle(fetch, params.slug),
		getArticles(fetch)
	]);
	if (!article) error(404, 'Article not found');

	const list = articles ?? [];
	const idx = list.findIndex((a) => a.slug === article.slug);
	const next = list.length > 1 && idx >= 0 ? list[(idx + 1) % list.length] : null;

	return { article, next };
};
