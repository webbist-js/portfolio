import type { ThisWeekItem } from '$lib/components/ui/ThisWeek.svelte';
import { getGithubActivities } from '$lib/server/github';
import { isr } from '$lib/server/isr';
import {
	getArticles,
	getHomepage,
	getProjects,
	getServices,
	getTestimonials,
	type Activity,
	type Article,
	type Homepage
} from '$lib/strapi';
import type { PageServerLoad } from './$types';

export const config = isr(300);

const FRESH_ARTICLE_MS = 14 * 86400000;
const THIS_WEEK_LIMIT = 3;

/* Curated CMS entries rank first, then a fresh article, then commits
 * (already one-per-repo, newest first) fill the remaining slots. */
function buildThisWeek(
	homepage: Homepage | null,
	articles: Article[],
	github: Activity[] | null
): ThisWeekItem[] {
	const items: ThisWeekItem[] = (homepage?.thisWeek ?? []).map((m) => ({
		text: m.text,
		highlight: m.highlight ?? false
	}));

	const fresh = articles.find(
		(a) => a.date && Date.now() - new Date(a.date).getTime() < FRESH_ARTICLE_MS
	);
	if (fresh && items.length < THIS_WEEK_LIMIT) {
		items.push({
			text: `Writing — “${fresh.title}”`,
			href: fresh.externalUrl ?? `/writing/${fresh.slug}`
		});
	}

	for (const commit of github ?? []) {
		if (items.length >= THIS_WEEK_LIMIT) break;
		items.push({
			code: commit.repo.split('/')[1] ?? commit.repo,
			text: commit.message,
			highlight: commit.highlight
		});
	}
	return items.slice(0, THIS_WEEK_LIMIT);
}

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
		thisWeek: buildThisWeek(homepage, articles ?? [], github),
		services,
		projects,
		articles,
		testimonials
	};
};
