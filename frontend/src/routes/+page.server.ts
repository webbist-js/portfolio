import { getGithubActivities } from '$lib/server/github';
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
	const [homepage, cmsActivities, github, services, projects, articles, testimonials] =
		await Promise.all([
			getHomepage(fetch),
			getActivities(fetch),
			getGithubActivities(fetch),
			getServices(fetch),
			getProjects(fetch),
			getArticles(fetch),
			getTestimonials(fetch)
		]);
	return {
		homepage,
		activities: github ?? cmsActivities,
		services,
		projects,
		articles,
		testimonials
	};
};
