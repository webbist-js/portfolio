import { fail } from '@sveltejs/kit';
import { getBooks, getExperiences, getPrinciples } from '$lib/strapi';
import { isValidEmail, submitToStrapi } from '$lib/server/forms';
import { getGithubActivities } from '$lib/server/github';
import { isr } from '$lib/server/isr';
import type { Actions, PageServerLoad } from './$types';

export const config = isr();

export const load: PageServerLoad = async ({ fetch }) => {
	const [experiences, principles, books, github] = await Promise.all([
		getExperiences(fetch),
		getPrinciples(fetch),
		getBooks(fetch),
		getGithubActivities(fetch)
	]);
	// Live GitHub data or nothing — the banner feed never shows placeholders.
	return { experiences, principles, books, activities: github ?? [] };
};

export const actions: Actions = {
	contact: async ({ request, fetch }) => {
		const data = await request.formData();

		// Honeypot filled → almost certainly a bot; pretend it worked.
		if (data.get('company')) return { sent: true };

		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const message = String(data.get('message') ?? '').trim();
		const values = { name, email, message };

		if (!name || !message || !isValidEmail(email)) {
			return fail(400, {
				error: 'Please fill in your name, a valid email address, and a message.',
				values
			});
		}

		const status = await submitToStrapi(fetch, 'contact-messages', values);
		if (status === 201) return { sent: true };

		return fail(502, { error: 'Something went wrong — please try again shortly.', values });
	}
};
