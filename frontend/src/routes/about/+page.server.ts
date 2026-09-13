import { fail } from '@sveltejs/kit';
import { getBooks, getExperiences, getPrinciples } from '$lib/strapi';
import { isValidEmail, submitToStrapi } from '$lib/server/forms';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [experiences, principles, books] = await Promise.all([
		getExperiences(fetch),
		getPrinciples(fetch),
		getBooks(fetch)
	]);
	return { experiences, principles, books };
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
