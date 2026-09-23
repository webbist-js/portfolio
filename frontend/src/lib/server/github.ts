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
 * to the Activity shape used by ActivityFeed. Only repos in `allow`
 * (full names, `owner/repo`) are considered: the account also holds
 * personal repos whose commits have no place on a professional site.
 * Returns null on any failure so callers can fall back to CMS-managed
 * activities. */
export async function fetchGithubActivities(
	f: Fetch,
	token: string,
	allow: Set<string>,
	limit = 6
): Promise<Activity[] | null> {
	try {
		const repoRes = await f(`${API}/user/repos?sort=pushed&direction=desc&per_page=100`, {
			headers: headers(token)
		});
		if (!repoRes.ok) return null;
		const repos = ((await repoRes.json()) as GithubRepo[])
			.filter((r) => !r.fork && allow.has(r.full_name.toLowerCase()))
			.slice(0, limit);

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

/** Comma-separated `owner/repo` names allowed on the feed. Unset means no
 * commits at all, which is the safe default: nothing personal leaks because
 * an env var was forgotten. */
export function feedAllowlist(raw: string | undefined): Set<string> {
	return new Set(
		(raw ?? '')
			.split(',')
			.map((r) => r.trim().toLowerCase())
			.filter(Boolean)
	);
}

/** Cached entry point for page loads. Returns null when GITHUB_TOKEN or
 * GITHUB_FEED_REPOS is unset (local dev, previews) or GitHub is unreachable. */
export async function getGithubActivities(f: Fetch): Promise<Activity[] | null> {
	// GH_FEED_TOKEN is an alias in case the platform rejects the primary name.
	const token = env.GITHUB_TOKEN || env.GH_FEED_TOKEN;
	const allow = feedAllowlist(env.GITHUB_FEED_REPOS);
	if (!token || allow.size === 0) return null;
	if (cache && cache.expires > Date.now()) return cache.feed;
	const feed = await fetchGithubActivities(f, token, allow);
	if (feed) cache = { feed, expires: Date.now() + CACHE_TTL_MS };
	return feed;
}
