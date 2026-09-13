import { PUBLIC_SITE_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const prerender = false;

export const GET: RequestHandler = () => {
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${new URL('/sitemap.xml', PUBLIC_SITE_URL)}`
	].join('\n');
	return new Response(body, { headers: { 'content-type': 'text/plain' } });
};
