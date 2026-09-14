import { BYPASS_TOKEN } from '$env/static/private';

/**
 * Route config for Vercel ISR. Pages stay cached until /api/revalidate
 * purges them; `expiration` is only a safety net if a purge is lost.
 * `allowQuery: []` keeps every query variant on one cache entry; the
 * adapter's own `__pathname` key is always added by adapter-vercel.
 */
export const isr = (expiration: number | false = 3600) => ({
	isr: { expiration, bypassToken: BYPASS_TOKEN, allowQuery: [] as string[] }
});
