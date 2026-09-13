import { getFaqs, getProcessPhases, getServices } from '$lib/strapi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [services, phases, faqs] = await Promise.all([
		getServices(fetch),
		getProcessPhases(fetch),
		getFaqs(fetch)
	]);
	return { services, phases, faqs };
};
