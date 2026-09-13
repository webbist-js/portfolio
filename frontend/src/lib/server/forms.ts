import { PUBLIC_STRAPI_URL } from '$env/static/public';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string) => EMAIL_RE.test(value);

/**
 * POSTs a form submission to a public create-only Strapi endpoint.
 * Returns Strapi's HTTP status (0 when the CMS is unreachable).
 */
export async function submitToStrapi(
	fetcher: typeof fetch,
	endpoint: 'contact-messages' | 'newsletter-subscribers',
	data: Record<string, string>
): Promise<number> {
	try {
		const res = await fetcher(`${PUBLIC_STRAPI_URL}/api/${endpoint}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ data })
		});
		return res.status;
	} catch {
		return 0;
	}
}
