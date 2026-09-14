# Page Transitions + ISR Revalidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animate route changes with the View Transitions API, and serve content pages from Vercel ISR that Strapi purges on publish.

**Architecture:** Frontend: `onNavigate` + named view-transition groups in the root layout; per-slug title names on list rows and detail h1s. Caching: adapter-vercel ISR config on the seven content pages, a bearer-protected `POST /api/revalidate` that maps `{model, slug}` entries to paths and hits them with Vercel's `x-prerender-revalidate` header. Backend: a Strapi 5 document-service middleware that batches publish/unpublish/delete events and POSTs them to that endpoint.

**Tech Stack:** SvelteKit 2.63 / Svelte 5 runes, `@sveltejs/adapter-vercel`, Vitest (server project), Strapi 5.53 (TS, CommonJS).

Spec: `docs/superpowers/specs/2026-09-14-page-transitions-and-isr-design.md`

## Global Constraints

- Node 24: prefix `PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH` in every shell command.
- The rtk hook breaks bare `npx`: use npm scripts or `rtk proxy npx …`.
- After code edits run only `npm run check` (+ targeted curl). `npm run lint` before committing. Full e2e + axe once, at the very end. No push in this plan (needs Vercel/Strapi Cloud env vars set by the user first).
- Dev servers usually already running: Strapi :1337, frontend :5173 — curl before booting. Restart Strapi only in Task 6 (backend code changes).
- Commits: concise, no Co-Authored-By.
- Design language unchanged: motion uses `--ease-out`; reduced motion must disable every transition.
- Content pages: `/`, `/work`, `/work/[slug]`, `/services`, `/writing`, `/writing/[slug]`, `/about`.
- Env names are fixed: frontend `BYPASS_TOKEN` (static private), `REVALIDATE_SECRET` (dynamic private); backend `FRONTEND_REVALIDATE_URL`, `REVALIDATE_SECRET`.
- Working directory for frontend commands: `frontend/`; backend: `backend/`.

---

## File map

| File | Responsibility |
| --- | --- |
| `frontend/src/routes/+layout.svelte` | `onNavigate` view-transition wrapper; `view-transition-name` on shell parts |
| `frontend/src/lib/styles/base.css` | `main` group animation, keyframes, reduced-motion pseudo-element rule |
| `frontend/src/lib/components/ui/ProjectRow.svelte`, `ArticleRow.svelte` | `title-<slug>` name on the title span |
| `frontend/src/routes/writing/+page.svelte` | `title-<slug>` on the featured h2 |
| `frontend/src/routes/work/[slug]/+page.svelte`, `writing/[slug]/+page.svelte` | `title-<slug>` on h1 |
| `frontend/vite.config.ts` | adapter-vercel |
| `frontend/src/lib/server/isr.ts` | `isr(expiration)` route-config factory |
| `frontend/src/routes/**/+page.server.ts` (7) | `export const config = isr(...)` |
| `frontend/src/lib/server/revalidate.ts` (+ `.test.ts`) | pure `pathsFor`, `needsSlugs`, `withDataPaths`, `isAuthorized` |
| `frontend/src/routes/api/revalidate/+server.ts` | POST endpoint: auth, slug lookup, fan-out |
| `frontend/.env.example`, `.github/workflows/ci.yml` | new env vars |
| `backend/src/revalidate.ts` | `shouldRevalidate`, `registerRevalidation` (document middleware + batching) |
| `backend/src/index.ts` | call `registerRevalidation` in `register()` |
| `backend/.env.example` | new env vars |

---

### Task 1: View transitions for route changes

**Files:**
- Modify: `frontend/src/routes/+layout.svelte:1-25` (script) and `:130+` (styles)
- Modify: `frontend/src/lib/styles/base.css:188-200`

**Interfaces:**
- Produces: `view-transition-name: main` on `<main>`; CSS group animations later tasks rely on (title morphs ride on the same transition).

- [ ] **Step 1: Add `onNavigate` to the layout script**

In `frontend/src/routes/+layout.svelte`, add the import and the hook after `let { children, data } = $props();`:

```svelte
<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { openBookCall } from '$lib/book-call.svelte';
	import { BookCallModal } from '$lib/components';
	import '$lib/styles/tokens.css';
	import '$lib/styles/base.css';

	let { children, data } = $props();

	// Cross-document-style page transitions via the View Transitions API.
	// Progressive enhancement: unsupported browsers navigate as normal.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
```

Keep the rest of the script (`nav`, `isActive`, `name`, `year`) unchanged.

- [ ] **Step 2: Pin the shell parts and name `main`**

In the layout `<style>` block add `view-transition-name` to the existing rules (do not duplicate the rules, add the line):

```css
	.status-strip {
		/* existing declarations … */
		view-transition-name: status;
	}

	.site-header {
		/* existing declarations … */
		view-transition-name: header;
	}

	main {
		min-height: 60vh;
		view-transition-name: main;
	}

	.site-footer {
		/* existing declarations … */
		view-transition-name: footer;
	}
```

- [ ] **Step 3: Add the group animations to base.css**

Insert before the existing `@media (prefers-reduced-motion: reduce)` block in `frontend/src/lib/styles/base.css`:

```css
/* Page transitions (View Transitions API). Only <main> moves; the shell
   parts are pinned by their own names in +layout.svelte. */
::view-transition-old(root),
::view-transition-new(root),
::view-transition-old(status),
::view-transition-new(status),
::view-transition-old(header),
::view-transition-new(header),
::view-transition-old(footer),
::view-transition-new(footer) {
	animation: none;
}

::view-transition-old(main) {
	animation: 160ms ease-in both vt-fade-out;
}

::view-transition-new(main) {
	animation:
		240ms var(--ease-out) both vt-fade-in,
		240ms var(--ease-out) both vt-rise;
}

@keyframes vt-fade-out {
	to {
		opacity: 0;
	}
}

@keyframes vt-fade-in {
	from {
		opacity: 0;
	}
}

@keyframes vt-rise {
	from {
		transform: translateY(8px);
	}
}
```

Then extend the existing reduced-motion block so it also covers the pseudo-elements (the `*` selector does not match them):

```css
@media (prefers-reduced-motion: reduce) {
	.pulse {
		animation: none;
	}

	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}

	::view-transition-group(*),
	::view-transition-old(*),
	::view-transition-new(*) {
		animation: none !important;
	}
}
```

- [ ] **Step 4: Type-check**

Run: `cd frontend && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`.

- [ ] **Step 5: Smoke the layout still renders**

Run: `curl -s http://localhost:5173/ | grep -c 'view-transition-name'`
Expected: `0` is fine (styles are in the compiled CSS, not inline); the point is a 200 with HTML. If the dev server is down, skip — Task 7's build covers it.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/routes/+layout.svelte frontend/src/lib/styles/base.css
git commit -m "Page transitions: fade+rise main content on navigation via View Transitions API"
```

---

### Task 2: Shared-element title morphs

**Files:**
- Modify: `frontend/src/lib/components/ui/ProjectRow.svelte:13`
- Modify: `frontend/src/lib/components/ui/ArticleRow.svelte:23`
- Modify: `frontend/src/routes/writing/+page.svelte:99`
- Modify: `frontend/src/routes/work/[slug]/+page.svelte:35`
- Modify: `frontend/src/routes/writing/[slug]/+page.svelte:36`

**Interfaces:**
- Naming convention: `title-${slug}` (slugs are kebab-case, valid CSS idents). Each name appears at most once per page: on `/writing` the featured item is already excluded from the archive rows (`archive = filtered.filter((a) => a !== featured)`), and `/work` renders rows only, so no dedupe code is needed.

- [ ] **Step 1: Name the row titles**

`ProjectRow.svelte` line 13:

```svelte
		<span class="name" style:view-transition-name={`title-${project.slug}`}>{project.name}</span>
```

`ArticleRow.svelte` line 23:

```svelte
		<span class="title" style:view-transition-name={`title-${article.slug}`}>{article.title}</span>
```

- [ ] **Step 2: Name the featured h2 on the writing index**

`frontend/src/routes/writing/+page.svelte` line 99:

```svelte
			<h2 style:view-transition-name={`title-${featured.slug}`}>{featured.title}</h2>
```

- [ ] **Step 3: Name the detail h1s**

`frontend/src/routes/work/[slug]/+page.svelte` line 35:

```svelte
		<h1 style:view-transition-name={`title-${p.slug}`}>{p.name}</h1>
```

`frontend/src/routes/writing/[slug]/+page.svelte` line 36:

```svelte
		<h1 style:view-transition-name={`title-${a.slug}`}>{a.title}</h1>
```

- [ ] **Step 4: Type-check and lint**

Run: `cd frontend && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm run check && npm run lint`
Expected: 0 errors; prettier/eslint clean. If prettier reformats the `style:` lines, run `npm run format` and re-check.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/components/ui/ProjectRow.svelte frontend/src/lib/components/ui/ArticleRow.svelte frontend/src/routes/writing/+page.svelte 'frontend/src/routes/work/[slug]/+page.svelte' 'frontend/src/routes/writing/[slug]/+page.svelte'
git commit -m "Shared-element title morph between list rows and detail pages"
```

---

### Task 3: adapter-vercel + ISR route config

**Files:**
- Modify: `frontend/package.json` (dev dep swap), `frontend/vite.config.ts:3,18`
- Create: `frontend/src/lib/server/isr.ts`
- Modify: the 7 `+page.server.ts` loaders
- Modify: `frontend/.env.example`, `.github/workflows/ci.yml:12-14`, local `frontend/.env.local`

**Interfaces:**
- Produces: `isr(expiration?: number | false)` returning `{ isr: { expiration, bypassToken, allowQuery: [] } }`; `BYPASS_TOKEN` env consumed again in Task 5.

- [ ] **Step 1: Swap the adapter**

Run: `cd frontend && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm uninstall @sveltejs/adapter-auto && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm install -D @sveltejs/adapter-vercel`
Expected: package.json devDependencies lists `@sveltejs/adapter-vercel`, not adapter-auto.

Edit `frontend/vite.config.ts`:

```ts
import adapter from '@sveltejs/adapter-vercel';
```

and replace the adapter comment block + call with:

```ts
			adapter: adapter()
```

- [ ] **Step 2: Add the env var everywhere it must exist**

`frontend/.env.example` — append:

```bash
# Vercel ISR bypass token: any long random string. Build-time (static) env —
# the build fails without it. The same value authenticates on-demand purges.
BYPASS_TOKEN=
# Shared secret Strapi sends to POST /api/revalidate (runtime env).
REVALIDATE_SECRET=
```

`.github/workflows/ci.yml` top-level `env`:

```yaml
env:
  PUBLIC_STRAPI_URL: http://localhost:1337
  PUBLIC_SITE_URL: http://localhost:4173
  BYPASS_TOKEN: ci-bypass-token
```

Local: find where `PUBLIC_STRAPI_URL` is defined (`grep -l PUBLIC_STRAPI_URL frontend/.env*; env | grep PUBLIC_STRAPI_URL`) and append `BYPASS_TOKEN=dev-bypass-token` to `frontend/.env.local` (gitignored) regardless — Vite loads it.

- [ ] **Step 3: Create the ISR helper**

`frontend/src/lib/server/isr.ts`:

```ts
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
```

- [ ] **Step 4: Apply to the seven loaders**

Add to each file, after the imports:

`frontend/src/routes/+page.server.ts` (GitHub feed keeps 5-minute freshness):

```ts
import { isr } from '$lib/server/isr';

export const config = isr(300);
```

`work/+page.server.ts`, `work/[slug]/+page.server.ts`, `services/+page.server.ts`, `writing/+page.server.ts`, `writing/[slug]/+page.server.ts`, `about/+page.server.ts`:

```ts
import { isr } from '$lib/server/isr';

export const config = isr();
```

- [ ] **Step 5: Type-check**

Run: `cd frontend && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm run check`
Expected: 0 errors. (A missing `BYPASS_TOKEN` shows as `'$env/static/private' has no exported member` — fix Step 2.)

- [ ] **Step 6: Build and confirm ISR covers data requests**

Run: `cd frontend && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm run build && ls .vercel/output/functions && grep -o '"src":"[^"]*__data.json[^"]*"' .vercel/output/config.json | head`
Expected: `*.prerender-config.json` files exist for the content routes and `config.json` routes map the `__data.json` variants to the same ISR functions. If `__data.json` routes are NOT present, add `'x-sveltekit-invalidated'` handling by reading `node_modules/@sveltejs/adapter-vercel/index.js` and record the finding in the commit message; do not proceed to Task 5 until data paths are confirmed cached or the fan-out is adjusted.

- [ ] **Step 7: Commit**

```bash
git add frontend/package.json package-lock.json frontend/vite.config.ts frontend/src/lib/server/isr.ts frontend/src/routes frontend/.env.example .github/workflows/ci.yml
git commit -m "ISR on content pages via adapter-vercel (bypass-token purges, hourly fallback, 5 min homepage)"
```

---

### Task 4: Path mapping (pure) with tests

**Files:**
- Create: `frontend/src/lib/server/revalidate.ts`
- Test: `frontend/src/lib/server/revalidate.test.ts`

**Interfaces:**
- Produces:
  - `type RevalidateEntry = { model: string; slug?: string }`
  - `interface SlugLists { projects: string[]; articles: string[] }`
  - `pathsFor(entries: RevalidateEntry[], slugs: SlugLists): string[]`
  - `needsSlugs(entries: RevalidateEntry[]): boolean`
  - `withDataPaths(paths: string[], cap?: number): string[]`
  - `isAuthorized(header: string | null, secret: string): boolean`

- [ ] **Step 1: Write the failing tests**

`frontend/src/lib/server/revalidate.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { isAuthorized, needsSlugs, pathsFor, withDataPaths } from './revalidate';

const slugs = { projects: ['alpha', 'beta'], articles: ['one'] };

describe('pathsFor', () => {
	it('purges everything for global', () => {
		expect(pathsFor([{ model: 'global' }], slugs).sort()).toEqual(
			['/', '/about', '/services', '/work', '/work/alpha', '/work/beta', '/writing', '/writing/one'].sort()
		);
	});

	it('maps a project to home, index and every detail (next links)', () => {
		expect(pathsFor([{ model: 'project', slug: 'alpha' }], slugs).sort()).toEqual(
			['/', '/work', '/work/alpha', '/work/beta'].sort()
		);
	});

	it('includes a deleted slug no longer in the list', () => {
		expect(pathsFor([{ model: 'project', slug: 'gone' }], slugs)).toContain('/work/gone');
	});

	it('maps articles and topics to writing pages', () => {
		expect(pathsFor([{ model: 'topic' }], slugs).sort()).toEqual(['/', '/writing', '/writing/one']);
		expect(pathsFor([{ model: 'article', slug: 'new' }], slugs)).toContain('/writing/new');
	});

	it('maps the remaining models', () => {
		expect(pathsFor([{ model: 'homepage' }], slugs)).toEqual(['/']);
		for (const model of ['service', 'process-phase', 'faq', 'testimonial'])
			expect(pathsFor([{ model }], slugs).sort()).toEqual(['/', '/services']);
		for (const model of ['experience', 'principle', 'book'])
			expect(pathsFor([{ model }], slugs)).toEqual(['/about']);
		expect(pathsFor([{ model: 'activity' }], slugs).sort()).toEqual(['/', '/about']);
	});

	it('ignores unknown models and dedupes across entries', () => {
		expect(pathsFor([{ model: 'contact-message' }], slugs)).toEqual([]);
		expect(pathsFor([{ model: 'faq' }, { model: 'service' }], slugs).sort()).toEqual(['/', '/services']);
	});
});

describe('needsSlugs', () => {
	it('is true only for models that touch detail pages', () => {
		expect(needsSlugs([{ model: 'faq' }])).toBe(false);
		expect(needsSlugs([{ model: 'faq' }, { model: 'article' }])).toBe(true);
		expect(needsSlugs([{ model: 'global' }])).toBe(true);
	});
});

describe('withDataPaths', () => {
	it('adds the SvelteKit data path for each page', () => {
		expect(withDataPaths(['/', '/work/alpha'])).toEqual([
			'/',
			'/__data.json',
			'/work/alpha',
			'/work/alpha/__data.json'
		]);
	});

	it('caps the fan-out', () => {
		const many = Array.from({ length: 150 }, (_, i) => `/p/${i}`);
		expect(withDataPaths(many, 200)).toHaveLength(200);
	});
});

describe('isAuthorized', () => {
	it('accepts only the exact bearer secret', () => {
		expect(isAuthorized('Bearer s3cret', 's3cret')).toBe(true);
		expect(isAuthorized('Bearer s3cre', 's3cret')).toBe(false);
		expect(isAuthorized('s3cret', 's3cret')).toBe(false);
		expect(isAuthorized(null, 's3cret')).toBe(false);
	});
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd frontend && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm run test:unit -- --run --project server src/lib/server/revalidate.test.ts`
Expected: FAIL — cannot resolve `./revalidate`.

- [ ] **Step 3: Implement**

`frontend/src/lib/server/revalidate.ts`:

```ts
import { timingSafeEqual } from 'node:crypto';

export type RevalidateEntry = { model: string; slug?: string };

export interface SlugLists {
	projects: string[];
	articles: string[];
}

const INDEX_PAGES = ['/', '/work', '/services', '/writing', '/about'];
const SLUG_MODELS = new Set(['global', 'project', 'article', 'topic']);
const SERVICES_MODELS = new Set(['service', 'process-phase', 'faq', 'testimonial']);
const ABOUT_MODELS = new Set(['experience', 'principle', 'book']);

/** Which ISR pages a set of CMS changes can affect (see spec table). */
export function pathsFor(entries: RevalidateEntry[], slugs: SlugLists): string[] {
	const out = new Set<string>();
	const add = (paths: string[]) => paths.forEach((p) => out.add(p));
	const work = slugs.projects.map((s) => `/work/${s}`);
	const writing = slugs.articles.map((s) => `/writing/${s}`);

	for (const { model, slug } of entries) {
		if (model === 'global') add([...INDEX_PAGES, ...work, ...writing]);
		else if (model === 'homepage') add(['/']);
		else if (model === 'project') add(['/', '/work', ...work, ...(slug ? [`/work/${slug}`] : [])]);
		else if (model === 'article' || model === 'topic')
			add(['/', '/writing', ...writing, ...(slug && model === 'article' ? [`/writing/${slug}`] : [])]);
		else if (SERVICES_MODELS.has(model)) add(['/', '/services']);
		else if (ABOUT_MODELS.has(model)) add(['/about']);
		else if (model === 'activity') add(['/', '/about']);
	}
	return [...out];
}

export const needsSlugs = (entries: RevalidateEntry[]) =>
	entries.some((e) => SLUG_MODELS.has(e.model));

/** Each page has a sibling `__data.json` entry in the ISR cache. */
export function withDataPaths(paths: string[], cap = 200): string[] {
	const out = new Set<string>();
	for (const p of paths) {
		out.add(p);
		out.add(p === '/' ? '/__data.json' : `${p}/__data.json`);
	}
	return [...out].slice(0, cap);
}

export function isAuthorized(header: string | null, secret: string): boolean {
	if (!header?.startsWith('Bearer ')) return false;
	const given = Buffer.from(header.slice(7));
	const expected = Buffer.from(secret);
	return given.length === expected.length && timingSafeEqual(given, expected);
}
```

- [ ] **Step 4: Run tests**

Run: `cd frontend && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm run test:unit -- --run --project server src/lib/server/revalidate.test.ts`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/server/revalidate.ts frontend/src/lib/server/revalidate.test.ts
git commit -m "Revalidation path map: model -> ISR pages, data paths, bearer auth"
```

---

### Task 5: `POST /api/revalidate` endpoint

**Files:**
- Create: `frontend/src/routes/api/revalidate/+server.ts`

**Interfaces:**
- Consumes: Task 4 functions; `BYPASS_TOKEN` (static), `REVALIDATE_SECRET` (dynamic), `PUBLIC_SITE_URL`; `getProjects`/`getArticles` from `$lib/strapi`.
- Produces: `POST { entries: RevalidateEntry[] }` → `200 { revalidated: string[], failed: string[] }`; `401`, `400`, `503`.

- [ ] **Step 1: Implement the endpoint**

`frontend/src/routes/api/revalidate/+server.ts`:

```ts
import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { BYPASS_TOKEN } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { getArticles, getProjects } from '$lib/strapi';
import {
	isAuthorized,
	needsSlugs,
	pathsFor,
	withDataPaths,
	type RevalidateEntry,
	type SlugLists
} from '$lib/server/revalidate';
import type { RequestHandler } from './$types';

const MODEL_RE = /^[a-z][a-z0-9-]{0,40}$/;

function parseEntries(body: unknown): RevalidateEntry[] {
	const raw = (body as { entries?: unknown })?.entries;
	if (!Array.isArray(raw)) return [];
	return raw.flatMap((e) => {
		const model = (e as { model?: unknown })?.model;
		const slug = (e as { slug?: unknown })?.slug;
		if (typeof model !== 'string' || !MODEL_RE.test(model)) return [];
		return [{ model, slug: typeof slug === 'string' ? slug : undefined }];
	});
}

/** Strapi calls this after publish/unpublish/delete; we purge the ISR
 * cache for every page that can show the changed content. */
export const POST: RequestHandler = async ({ request, fetch }) => {
	const secret = env.REVALIDATE_SECRET;
	if (!secret) error(503, 'Revalidation is not configured');
	if (!isAuthorized(request.headers.get('authorization'), secret)) error(401, 'Unauthorized');

	let entries: RevalidateEntry[];
	try {
		entries = parseEntries(await request.json());
	} catch {
		error(400, 'Body must be JSON');
	}
	if (!entries.length) error(400, 'No valid entries');

	const failed: string[] = [];
	let slugs: SlugLists = { projects: [], articles: [] };
	if (needsSlugs(entries)) {
		const [projects, articles] = await Promise.all([getProjects(fetch), getArticles(fetch)]);
		if (!projects || !articles) failed.push('slug-lookup');
		slugs = {
			projects: (projects ?? []).map((p) => p.slug),
			articles: (articles ?? []).map((a) => a.slug)
		};
	}

	const paths = withDataPaths(pathsFor(entries, slugs));
	const results = await Promise.allSettled(
		paths.map(async (path) => {
			const res = await fetch(new URL(path, PUBLIC_SITE_URL), {
				headers: { 'x-prerender-revalidate': BYPASS_TOKEN }
			});
			if (!res.ok && res.status !== 404) throw new Error(`${res.status}`);
		})
	);

	const revalidated: string[] = [];
	results.forEach((r, i) => (r.status === 'fulfilled' ? revalidated : failed).push(paths[i]));
	console.info(`revalidate: ${revalidated.length} ok, ${failed.length} failed`, entries);
	return json({ revalidated, failed });
};
```

Note: a 404 counts as success — revalidating a deleted slug legitimately regenerates a 404 page.

- [ ] **Step 2: Type-check**

Run: `cd frontend && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm run check`
Expected: 0 errors.

- [ ] **Step 3: Curl it locally**

Ensure `frontend/.env.local` also has `REVALIDATE_SECRET=dev-secret` (restart the frontend dev server if it was already running so dynamic env reloads — `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173/` first to see whether it is up).

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:5173/api/revalidate -H 'content-type: application/json' -d '{"entries":[{"model":"faq"}]}'
curl -s -X POST http://localhost:5173/api/revalidate -H 'authorization: Bearer dev-secret' -H 'content-type: application/json' -d '{"entries":[{"model":"project","slug":"the-british-library"}]}'
```

Expected: first prints `401`; second prints JSON whose `revalidated` contains `/`, `/work`, `/work/the-british-library`, and their `__data.json` siblings, with `failed: []`.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/routes/api/revalidate/+server.ts
git commit -m "POST /api/revalidate: bearer-protected ISR purge fan-out"
```

---

### Task 6: Strapi document-service middleware

**Files:**
- Create: `backend/src/revalidate.ts`
- Modify: `backend/src/index.ts:24-25`
- Modify: `backend/.env.example` (append)

**Interfaces:**
- Consumes: Task 5 endpoint contract.
- Produces: `shouldRevalidate(action, hasDraftAndPublish, status?)`, `registerRevalidation(strapi, apis)`.

- [ ] **Step 1: Create the middleware module**

`backend/src/revalidate.ts`:

```ts
import type { Core } from '@strapi/strapi';

type Entry = { model: string; slug?: string };

const PUBLISH_ACTIONS = new Set(['publish', 'unpublish', 'delete']);
const WRITE_ACTIONS = new Set(['create', 'update']);
const FLUSH_MS = 1500;

/** Only changes that alter *published* content should purge the site. */
export function shouldRevalidate(
  action: string,
  hasDraftAndPublish: boolean,
  status?: string
): boolean {
  if (PUBLISH_ACTIONS.has(action)) return true;
  if (WRITE_ACTIONS.has(action)) return !hasDraftAndPublish || status === 'published';
  return false;
}

const pickSlug = (result: unknown, params: unknown): string | undefined => {
  const r = result as { slug?: unknown; entries?: Array<{ slug?: unknown }> } | undefined;
  const p = params as { data?: { slug?: unknown } } | undefined;
  const slug = r?.slug ?? r?.entries?.[0]?.slug ?? p?.data?.slug;
  return typeof slug === 'string' ? slug : undefined;
};

/**
 * Registers a document-service middleware that batches content changes and
 * POSTs them to the frontend's /api/revalidate. No-op when env is unset.
 */
export function registerRevalidation(strapi: Core.Strapi, apis: string[]) {
  const url = process.env.FRONTEND_REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) {
    strapi.log.info('revalidate: FRONTEND_REVALIDATE_URL / REVALIDATE_SECRET unset — purge disabled');
    return;
  }

  const uids = new Set(apis.map((a) => `api::${a}.${a}`));
  const pending = new Map<string, Entry>();
  let timer: NodeJS.Timeout | null = null;

  const flush = async () => {
    timer = null;
    const entries = [...pending.values()];
    pending.clear();
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}` },
        body: JSON.stringify({ entries }),
      });
      if (!res.ok) {
        strapi.log.warn(`revalidate: frontend responded ${res.status}`);
        return;
      }
      const body = (await res.json()) as { revalidated?: string[]; failed?: string[] };
      strapi.log.info(
        `revalidate: purged ${body.revalidated?.length ?? 0} paths, ${body.failed?.length ?? 0} failed`
      );
    } catch (err) {
      strapi.log.warn(`revalidate: request failed — ${(err as Error).message}`);
    }
  };

  const enqueue = (entry: Entry) => {
    pending.set(`${entry.model}:${entry.slug ?? ''}`, entry);
    if (!timer) timer = setTimeout(flush, FLUSH_MS);
  };

  strapi.documents.use(async (ctx, next) => {
    const result = await next();
    if (!uids.has(ctx.uid)) return result;

    const contentType = strapi.contentTypes[ctx.uid];
    const hasDraftAndPublish = Boolean(contentType?.options?.draftAndPublish);
    const status = (ctx.params as { status?: string } | undefined)?.status;
    if (shouldRevalidate(ctx.action, hasDraftAndPublish, status)) {
      // api::project.project → project
      enqueue({ model: ctx.uid.split('.').pop() as string, slug: pickSlug(result, ctx.params) });
    }
    return result;
  });
}
```

- [ ] **Step 2: Wire it into `register()`**

`backend/src/index.ts` — add the import and replace the empty `register`:

```ts
import type { Core } from '@strapi/strapi';
import { registerRevalidation } from './revalidate';
```

```ts
  register({ strapi }: { strapi: Core.Strapi }) {
    registerRevalidation(strapi, PUBLIC_READ_APIS);
  },
```

- [ ] **Step 3: Document the env**

Append to `backend/.env.example`:

```bash
# Frontend ISR purge. Leave both empty locally to disable.
# Production: https://www.alex-bennett.co.uk/api/revalidate + the same secret as Vercel.
FRONTEND_REVALIDATE_URL=
REVALIDATE_SECRET=
```

- [ ] **Step 4: Type-check the backend**

Run: `cd backend && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm run check`
Expected: no output (tsc clean). If `ctx.action`/`ctx.uid` typing complains, type the middleware parameter as `Parameters<typeof strapi.documents.use>[0]` and keep the logic.

- [ ] **Step 5: Live check against the local frontend**

Add to `backend/.env` (gitignored): `FRONTEND_REVALIDATE_URL=http://localhost:5173/api/revalidate` and `REVALIDATE_SECRET=dev-secret`. Restart the Strapi dev server (backend code changed). Then republish an existing FAQ or project through the `strapi-local` MCP (`publish_project` on an existing documentId) and check the Strapi log for `revalidate: purged N paths`. Afterwards remove the two lines from `backend/.env` again (local default is disabled) — or leave them; harmless either way.

- [ ] **Step 6: Commit**

```bash
git add backend/src/revalidate.ts backend/src/index.ts backend/.env.example
git commit -m "Strapi: purge frontend ISR on publish/unpublish/delete via document middleware"
```

---

### Task 7: Final gates

- [ ] **Step 1: Lint + unit tests**

Run: `cd frontend && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm run lint && npm run test:unit -- --run`
Expected: clean; all unit tests pass.

- [ ] **Step 2: Full e2e + axe (once)**

Requires Strapi :1337 running with seeded content. Run: `cd frontend && PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH npm run test:e2e`
Expected: all pass. The webServer builds with adapter-vercel and serves via `vite preview` — ISR config is inert there.

- [ ] **Step 3: Report, do not push**

Before the next deploy the user must set: Vercel `BYPASS_TOKEN`, `REVALIDATE_SECRET`; Strapi Cloud `FRONTEND_REVALIDATE_URL=https://www.alex-bennett.co.uk/api/revalidate`, `REVALIDATE_SECRET`. After the first deploy: edit the availability note in Strapi Cloud and confirm the live site updates; submit the About contact form once (ISR + form action).
