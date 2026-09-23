import { getFaqs, getProcessPhases, getServicesWithQuotes } from '$lib/strapi';
import { isr } from '$lib/server/isr';
import type { PageServerLoad } from './$types';

export const config = isr();

export const load: PageServerLoad = async ({ fetch }) => {
	const [services, phases, faqs] = await Promise.all([
		getServicesWithQuotes(fetch),
		getProcessPhases(fetch),
		getFaqs(fetch)
	]);
	return { services, phases, faqs };
};
