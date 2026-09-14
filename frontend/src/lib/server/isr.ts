import { BYPASS_TOKEN } from '$env/static/private';

/**
 * Route config for Vercel ISR. Pages stay cached until /api/revalidate
 * purges them; `expiration` is only a safety net if a purge is lost.
 * `allowQuery: []` keeps SvelteKit's `__data.json?x-sveltekit-*` requests
 * on one cache entry.
 */
export const isr = (expiration: number | false = 3600) => ({
	isr: { expiration, bypassToken: BYPASS_TOKEN, allowQuery: [] as string[] }
});
