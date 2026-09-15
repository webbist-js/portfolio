import { fail } from '@sveltejs/kit';
import { getArticles, getTopics } from '$lib/strapi';
import { isValidEmail, submitToStrapi } from '$lib/server/forms';
import { isr } from '$lib/server/isr';
import type { Actions, PageServerLoad } from './$types';

export const config = isr();

export const load: PageServerLoad = async ({ fetch }) => {
	const [articles, topics] = await Promise.all([getArticles(fetch), getTopics(fetch)]);
	return { articles, topics };
};

export const actions: Actions = {
	subscribe: async ({ request, fetch }) => {
		const data = await request.formData();

		// Honeypot filled → almost certainly a bot; pretend it worked.
		if (data.get('company')) return { subscribed: true };

		const email = String(data.get('email') ?? '').trim();
		if (!isValidEmail(email)) {
			return fail(400, { error: 'Please enter a valid email address.', email });
		}

		const status = await submitToStrapi(fetch, 'newsletter-subscribers', { email });
		// 400 here means the unique-email constraint fired — already subscribed,
		// which we treat as success rather than leaking who is on the list.
		if (status === 201 || status === 400) return { subscribed: true };

		return fail(502, { error: 'Something went wrong. Please try again shortly.', email });
	}
};
