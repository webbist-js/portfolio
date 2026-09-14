import { describe, expect, it, vi } from 'vitest';
import { fetchGithubActivities } from './github';

vi.mock('$env/dynamic/private', () => ({ env: {} }));

const repo = (full_name: string, pushed_at: string, extra: Record<string, unknown> = {}) => ({
	full_name,
	default_branch: 'main',
	pushed_at,
	fork: false,
	...extra
});

const commit = (message: string, date: string) => [{ commit: { message, committer: { date } } }];

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' }
	});

const routed = (routes: Record<string, Response>) =>
	vi.fn().mockImplementation((url: string) => {
		const match = Object.entries(routes).find(([path]) => url.includes(path));
		return Promise.resolve(match ? match[1].clone() : json([], 404));
	}) as unknown as typeof fetch;

describe('fetchGithubActivities', () => {
	it('maps latest commits to the Activity shape, newest first', async () => {
		const f = routed({
			'/user/repos': json([
				repo('webbist-js/portfolio', '2026-09-12T10:00:00Z'),
				repo('webbist-js/client-cms', '2026-09-13T08:00:00Z')
			]),
			'/repos/webbist-js/portfolio/commits': json(
				commit('feat: hero feed\n\nlong body', '2026-09-12T10:00:00Z')
			),
			'/repos/webbist-js/client-cms/commits': json(
				commit('fix(api): guard empty payload', '2026-09-13T08:00:00Z')
			)
		});

		const feed = await fetchGithubActivities(f, 'tok');
		expect(feed?.map((a) => a.repo)).toEqual(['webbist-js/client-cms', 'webbist-js/portfolio']);
		expect(feed?.[1]).toMatchObject({
			documentId: 'gh-webbist-js/portfolio',
			message: 'feat: hero feed',
			branch: 'main',
			occurredAt: '2026-09-12T10:00:00Z'
		});
	});

	it('skips forks and unreadable repos', async () => {
		const f = routed({
			'/user/repos': json([
				repo('webbist-js/a-fork', '2026-09-13T08:00:00Z', { fork: true }),
				repo('webbist-js/empty', '2026-09-13T07:00:00Z'),
				repo('webbist-js/ok', '2026-09-13T06:00:00Z')
			]),
			'/repos/webbist-js/empty/commits': json({ message: 'Git Repository is empty.' }, 409),
			'/repos/webbist-js/ok/commits': json(commit('chore: deps', '2026-09-13T06:00:00Z'))
		});

		const feed = await fetchGithubActivities(f, 'tok');
		expect(feed?.map((a) => a.repo)).toEqual(['webbist-js/ok']);
	});

	it('returns null on API failure or an empty feed', async () => {
		await expect(
			fetchGithubActivities(routed({ '/user/repos': json({}, 401) }), 'tok')
		).resolves.toBeNull();
		await expect(
			fetchGithubActivities(routed({ '/user/repos': json([]) }), 'tok')
		).resolves.toBeNull();
	});
});
