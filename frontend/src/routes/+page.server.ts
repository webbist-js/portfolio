import { getGithubActivities } from '$lib/server/github';
import {
	getArticles,
	getHomepage,
	getProjects,
	getServices,
	getTestimonials
} from '$lib/strapi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [homepage, github, services, projects, articles, testimonials] = await Promise.all([
		getHomepage(fetch),
		getGithubActivities(fetch),
		getServices(fetch),
		getProjects(fetch),
		getArticles(fetch),
		getTestimonials(fetch)
	]);
	// The feed is real GitHub data or nothing — never fabricated placeholders.
	return {
		homepage,
		activities: github ?? [],
		services,
		projects,
		articles,
		testimonials
	};
};
