import { describe, expect, it, vi } from 'vitest';
import { getArticle, getArticles, getGlobal, getProject, getProjects, getServices } from './strapi';

vi.mock('$env/static/public', () => ({ PUBLIC_STRAPI_URL: 'http://cms.test' }));

const ok = (data: unknown) =>
	vi.fn().mockResolvedValue(
		new Response(JSON.stringify({ data, meta: {} }), {
			status: 200,
			headers: { 'content-type': 'application/json' }
		})
	) as unknown as typeof fetch;

const status = (code: number) =>
	vi.fn().mockResolvedValue(new Response('', { status: code })) as unknown as typeof fetch;

const failing = () =>
	vi.fn().mockRejectedValue(new Error('ECONNREFUSED')) as unknown as typeof fetch;

describe('strapi client', () => {
	it('returns the data payload for collections', async () => {
		const projects = [{ name: 'Meridian Commerce', slug: 'meridian-commerce' }];
		await expect(getProjects(ok(projects))).resolves.toEqual(projects);
	});

	it('returns the data payload for single types', async () => {
		const global = { name: 'Alex Bennett' };
		await expect(getGlobal(ok(global))).resolves.toEqual(global);
	});

	it('requests the expected endpoint with query params', async () => {
		const fetcher = ok([]);
		await getServices(fetcher);
		const url = new URL((fetcher as ReturnType<typeof vi.fn>).mock.calls[0][0] as string);
		expect(url.origin).toBe('http://cms.test');
		expect(url.pathname).toBe('/api/services');
		expect(url.searchParams.get('sort')).toBe('order:asc');
	});

	it('resolves a slug lookup to the first match', async () => {
		const fetcher = ok([{ slug: 'meridian-commerce' }, { slug: 'other' }]);
		await expect(getProject(fetcher, 'meridian-commerce')).resolves.toEqual({
			slug: 'meridian-commerce'
		});
		const url = new URL((fetcher as ReturnType<typeof vi.fn>).mock.calls[0][0] as string);
		expect(url.searchParams.get('filters[slug][$eq]')).toBe('meridian-commerce');
	});

	it('returns null when a slug lookup has no match', async () => {
		await expect(getArticle(ok([]), 'missing')).resolves.toBeNull();
	});

	it('returns null on non-2xx responses', async () => {
		await expect(getArticles(status(404))).resolves.toBeNull();
		await expect(getGlobal(status(500))).resolves.toBeNull();
	});

	it('returns null when the CMS is unreachable', async () => {
		await expect(getProjects(failing())).resolves.toBeNull();
	});
});
