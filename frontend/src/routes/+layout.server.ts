import { getGlobal } from '$lib/strapi';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	return { global: await getGlobal(fetch) };
};
