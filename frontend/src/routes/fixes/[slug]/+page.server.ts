import { error } from '@sveltejs/kit';
import { getFixPage, getFixPages } from '$lib/strapi';
import { isr } from '$lib/server/isr';
import type { PageServerLoad } from './$types';

export const config = isr();

export const load: PageServerLoad = async ({ fetch, params }) => {
	const [fixPage, all] = await Promise.all([getFixPage(fetch, params.slug), getFixPages(fetch)]);
	if (!fixPage) error(404, 'Not found');

	// F/01… index in hub display order (category order, then page order).
	const ordered = (all ?? []).toSorted(
		(a, b) => (a.category?.order ?? 99) - (b.category?.order ?? 99) || a.order - b.order
	);
	const idx = ordered.findIndex((p) => p.slug === params.slug);
	const fixCode = idx >= 0 ? `F/${String(idx + 1).padStart(2, '0')}` : null;

	return { fixPage, fixCode };
};
