import {
	getActivities,
	getArticles,
	getHomepage,
	getProjects,
	getServices,
	getTestimonials
} from '$lib/strapi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [homepage, activities, services, projects, articles, testimonials] = await Promise.all([
		getHomepage(fetch),
		getActivities(fetch),
		getServices(fetch),
		getProjects(fetch),
		getArticles(fetch),
		getTestimonials(fetch)
	]);
	return { homepage, activities, services, projects, articles, testimonials };
};
