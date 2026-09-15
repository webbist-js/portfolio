import { getFixesHub, getFixPages } from '$lib/strapi';
import { isr } from '$lib/server/isr';
import type { PageServerLoad } from './$types';

export const config = isr();

export const load: PageServerLoad = async ({ fetch }) => {
	const [hub, fixPages] = await Promise.all([getFixesHub(fetch), getFixPages(fetch)]);
	return { hub, fixPages };
};
