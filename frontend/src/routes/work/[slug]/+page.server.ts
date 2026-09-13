import { error } from '@sveltejs/kit';
import { getProject, getProjects } from '$lib/strapi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const [project, projects] = await Promise.all([
		getProject(fetch, params.slug),
		getProjects(fetch)
	]);
	if (!project) error(404, 'Project not found');

	const list = projects ?? [];
	const idx = list.findIndex((p) => p.slug === project.slug);
	const next = list.length > 1 && idx >= 0 ? list[(idx + 1) % list.length] : null;

	return { project, next };
};
