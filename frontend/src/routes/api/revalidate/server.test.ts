import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({ env: { REVALIDATE_SECRET: 's3cret' } }));
vi.mock('$env/static/private', () => ({ BYPASS_TOKEN: 'bypass' }));
vi.mock('$env/static/public', () => ({
	PUBLIC_SITE_URL: 'https://site.test',
	PUBLIC_STRAPI_URL: 'http://cms.test'
}));
vi.mock('$lib/strapi', () => ({
	getProjects: vi.fn().mockResolvedValue([{ slug: 'alpha' }]),
	getArticles: vi.fn().mockResolvedValue([]),
	getFixPages: vi.fn().mockResolvedValue([])
}));

import { POST } from './+server';

const post = async (body: unknown, auth?: string) =>
	POST({
		request: new Request('https://site.test/api/revalidate', {
			method: 'POST',
			headers: { 'content-type': 'application/json', ...(auth ? { authorization: auth } : {}) },
			body: typeof body === 'string' ? body : JSON.stringify(body)
		}),
		fetch: eventFetch
	} as unknown as Parameters<typeof POST>[0]);

const status = async (p: Promise<Response>) => {
	try {
		return (await p).status;
	} catch (e) {
		return (e as { status: number }).status;
	}
};

let eventFetch: ReturnType<typeof vi.fn>;
let platformFetch: ReturnType<typeof vi.fn>;

beforeEach(() => {
	eventFetch = vi.fn();
	platformFetch = vi.fn().mockResolvedValue(new Response('', { status: 200 }));
	vi.stubGlobal('fetch', platformFetch);
});

afterEach(() => vi.unstubAllGlobals());

describe('POST /api/revalidate', () => {
	it('rejects missing or wrong bearer', async () => {
		expect(await status(post({ entries: [{ model: 'faq' }] }))).toBe(401);
		expect(await status(post({ entries: [{ model: 'faq' }] }, 'Bearer nope'))).toBe(401);
	});

	it('rejects non-JSON and empty entries', async () => {
		expect(await status(post('not json', 'Bearer s3cret'))).toBe(400);
		expect(await status(post({ entries: [{ model: 'Bad Model' }] }, 'Bearer s3cret'))).toBe(400);
	});

	it('purges through the platform fetch with the bypass header, never event.fetch', async () => {
		const res = await post({ entries: [{ model: 'faq' }] }, 'Bearer s3cret');
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			revalidated: ['/', '/__data.json', '/services', '/services/__data.json'],
			failed: []
		});
		expect(eventFetch).not.toHaveBeenCalled();
		expect(platformFetch).toHaveBeenCalledTimes(4);
		const [url, init] = platformFetch.mock.calls[0];
		expect(String(url)).toBe('https://site.test/');
		expect(init.headers['x-prerender-revalidate']).toBe('bypass');
	});

	it('uses event.fetch only for the Strapi slug lookup and drops unsafe slugs', async () => {
		const res = await post({ entries: [{ model: 'project', slug: '../etc' }] }, 'Bearer s3cret');
		const body = await res.json();
		expect(body.revalidated).toContain('/work/alpha');
		expect(body.revalidated.some((p: string) => p.includes('..'))).toBe(false);
		expect(eventFetch).not.toHaveBeenCalled(); // getProjects is mocked; only the platform fetch fans out
		expect(platformFetch).toHaveBeenCalledTimes(6);
	});

	it('reports non-OK purges under failed and treats 404 as success', async () => {
		platformFetch
			.mockResolvedValueOnce(new Response('', { status: 500 }))
			.mockResolvedValue(new Response('', { status: 404 }));
		const body = await (await post({ entries: [{ model: 'homepage' }] }, 'Bearer s3cret')).json();
		expect(body).toEqual({ revalidated: ['/__data.json'], failed: ['/'] });
	});
});
