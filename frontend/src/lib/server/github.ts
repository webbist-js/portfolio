import { env } from '$env/dynamic/private';
import type { Activity } from '$lib/strapi';

type Fetch = typeof fetch;

interface GithubRepo {
	full_name: string;
	default_branch: string;
	pushed_at: string;
	fork: boolean;
}

interface GithubCommit {
	commit: {
		message: string;
		committer?: { date?: string };
		author?: { date?: string };
	};
}

const API = 'https://api.github.com';
const HIGHLIGHT_WINDOW_MS = 24 * 60 * 60 * 1000;
const CACHE_TTL_MS = 5 * 60 * 1000;

const headers = (token: string) => ({
	Authorization: `Bearer ${token}`,
	Accept: 'application/vnd.github+json',
	'X-GitHub-Api-Version': '2022-11-28'
});

/** Fetches the most recently pushed repos and maps their latest commit
 * to the Activity shape used by ActivityFeed. Returns null on any failure
 * so callers can fall back to CMS-managed activities. */
export async function fetchGithubActivities(
	f: Fetch,
	token: string,
	limit = 6
): Promise<Activity[] | null> {
	try {
		const repoRes = await f(`${API}/user/repos?sort=pushed&direction=desc&per_page=${limit + 4}`, {
			headers: headers(token)
		});
		if (!repoRes.ok) return null;
		const repos = ((await repoRes.json()) as GithubRepo[]).filter((r) => !r.fork).slice(0, limit);

		const activities = await Promise.all(
			repos.map(async (repo): Promise<Activity | null> => {
				const res = await f(`${API}/repos/${repo.full_name}/commits?per_page=1`, {
					headers: headers(token)
				});
				// Empty repos respond 409; skip anything unreadable.
				if (!res.ok) return null;
				const [latest] = (await res.json()) as GithubCommit[];
				if (!latest) return null;
				const occurredAt =
					latest.commit.committer?.date ?? latest.commit.author?.date ?? repo.pushed_at;
				return {
					documentId: `gh-${repo.full_name}`,
					repo: repo.full_name,
					message: latest.commit.message.split('\n')[0],
					branch: repo.default_branch,
					occurredAt,
					highlight: Date.now() - new Date(occurredAt).getTime() < HIGHLIGHT_WINDOW_MS
				};
			})
		);

		const feed = activities
			.filter((a): a is Activity => a !== null)
			.sort((a, b) => (b.occurredAt ?? '').localeCompare(a.occurredAt ?? ''));
		return feed.length ? feed : null;
	} catch {
		return null;
	}
}

let cache: { feed: Activity[]; expires: number } | null = null;

/** Cached entry point for page loads. Returns null when GITHUB_TOKEN is
 * unset (local dev, previews) or GitHub is unreachable. */
export async function getGithubActivities(f: Fetch): Promise<Activity[] | null> {
	// GH_FEED_TOKEN is an alias in case the platform rejects the primary name.
	const token = env.GITHUB_TOKEN || env.GH_FEED_TOKEN;
	if (!token) return null;
	if (cache && cache.expires > Date.now()) return cache.feed;
	const feed = await fetchGithubActivities(f, token);
	if (feed) cache = { feed, expires: Date.now() + CACHE_TTL_MS };
	return feed;
}
