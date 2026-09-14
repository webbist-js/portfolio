import { getProjects } from '$lib/strapi';
import { isr } from '$lib/server/isr';
import type { PageServerLoad } from './$types';

export const config = isr();

export const load: PageServerLoad = async ({ fetch }) => {
	return { projects: await getProjects(fetch) };
};
