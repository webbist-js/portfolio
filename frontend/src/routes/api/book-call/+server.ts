import { json } from '@sveltejs/kit';
import { isValidEmail, submitToStrapi } from '$lib/server/forms';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const data = await request.formData();

	// Honeypot filled → almost certainly a bot; pretend it worked.
	if (data.get('company')) return json({ sent: true });

	const name = String(data.get('name') ?? '').trim();
	const email = String(data.get('email') ?? '').trim();
	const message = String(data.get('message') ?? '').trim();

	if (!name || !message || !isValidEmail(email)) {
		return json(
			{ error: 'Please fill in your name, a valid email address, and a message.' },
			{ status: 400 }
		);
	}

	const status = await submitToStrapi(fetch, 'contact-messages', { name, email, message });
	if (status === 201) return json({ sent: true });

	return json({ error: 'Something went wrong. Please try again shortly.' }, { status: 502 });
};
