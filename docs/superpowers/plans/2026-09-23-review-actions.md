# Review Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Action the external site review: clarify the part-time delivery model, regroup services with deliverables, make case studies outcome-shaped, and remove the details that undercut credibility.

**Architecture:** Schema fields added through the generator (never hand-edit schema.json), frontend types and components updated so every new field is optional, production content written last through the `my-website` MCP once Strapi Cloud has the fields.

**Tech Stack:** Strapi 5 (TS), SvelteKit + Svelte 5 runes, Playwright e2e + axe, Vercel ISR.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-23-review-actions-design.md`.
- No em dashes, no prices, no specific location, no invented evidence. Humanising gate on all CMS prose.
- After code edits: `npm run check` only. `npm run lint` before commit. Full e2e + axe once before push.
- Node 24: prefix `PATH=~/.nvm/versions/node/v24.21.0/bin:$PATH`. Dev servers likely already running (Strapi :1337, frontend :5173).
- Production content via `my-website` MCP; local `strapi-local` for dev preview only.

---

### Task 1: Schema fields
**Files:** Modify `backend/scripts/generate-content-types.mjs` (service, project, article); run `node backend/scripts/generate-content-types.mjs`; restart local Strapi so SQLite picks up columns.
- [ ] service: `deliverables` text, `nextSteps` text, `sectors` string, `testimonial` oneToOne → testimonial.
- [ ] project: `kind` enum `['employed','independent']` default `employed`, `responsibility` text, `learned` text.
- [ ] article: `updated` date.
- [ ] Run generator; `cd backend && npm run check`; restart dev Strapi; curl `/api/services` to see new keys.
- [ ] Commit `Schema: service deliverables, project kind/responsibility/learned, article updated`.

### Task 2: Frontend types + fetchers
**Files:** `frontend/src/lib/strapi.ts`.
- [ ] Extend `Service`, `Project`, `Article` interfaces (all optional). `Project.kind?: 'employed' | 'independent'`.
- [ ] `getServices` populates `testimonial`. `getProject`/`getProjects` unchanged (populate `*` covers scalars).
- [ ] `npm run check`.

### Task 3: Services UI
**Files:** `frontend/src/lib/components/ui/ServiceCard.svelte`, `frontend/src/routes/services/+page.svelte`, `frontend/src/routes/+page.svelte` (section 01 sub-copy).
- [ ] ServiceCard: after description render `What you receive` (deliverables), `What happens next` (nextSteps), `sectors` mono line, then a small blockquote with the linked testimonial quote + author/role/company.
- [ ] Services hero lede: part-time, outside core hours, fixed-scope or advisory; public-sector line. "How an engagement runs" sub-copy rewritten for part-time.
- [ ] Homepage section 01 sub: "Part-time, fixed-scope engagements alongside my day job. Scoped up front."
- [ ] `npm run check`; curl `/services`.

### Task 4: Work UI
**Files:** `ProjectRow.svelte`, `FeaturedCaseCard.svelte`, `routes/work/+page.svelte`, `routes/work/[slug]/+page.svelte`.
- [ ] Shared label helper in `strapi.ts`: `projectKindLabel(kind) => 'Employed role' | 'Independent engagement'`.
- [ ] ProjectRow: kind label in meta line. Case-study header: kind Tag.
- [ ] Work stats: projects · years active · featured (drop clients).
- [ ] Case study sections: Challenge, My responsibility, Approach, Outcome, What I learned.
- [ ] FeaturedCaseCard: replace terminal with dossier `<dl>` (Role, Responsibility, Stack tags, Metrics); remove `aria-hidden`; metrics move into panel.
- [ ] `npm run check`; curl `/work`, `/work/the-british-library`.

### Task 5: Feed filter, CTA wording, FixCauses, article Updated
**Files:** `lib/server/github.ts`, `routes/+page.svelte`, `routes/services/+page.svelte`, `routes/work/+page.svelte`, `routes/fixes/+page.svelte` (CTA labels), `ui/BookCallModal.svelte`, `ui/FixCauses.svelte`, `routes/writing/[slug]/+page.svelte`, `.env.example` if present.
- [ ] github.ts: read `GITHUB_FEED_REPOS`; when unset return null; filter repos to the allowlist before fetching commits.
- [ ] Grep `Book a` → "Request a call" / "Request a discovery call"; modal `.sub` copy states 48-hour reply and free 30 minutes.
- [ ] FixCauses: label, barnote, visually-hidden text.
- [ ] Article meta: `{#if a.updated}<span>Updated {a.updated}</span>{/if}`.
- [ ] `npm run check`; `npm run lint`; commit `Frontend: review actions (services deliverables, work kinds, dossier card, feed allowlist, CTA wording)`.

### Task 6: Local preview content
- [ ] Via `strapi-local`: set one project (`a2x58…`) `kind`, `responsibility`, `learned`; one service (`q6a5…`) `deliverables`, `nextSteps`, `sectors`, `testimonial`. Curl the rendered pages for the new strings.
- [ ] Check `frontend/e2e/pages.ts` markers still resolve against local seed.

### Task 7: Gate + push
- [ ] `npm run test:e2e` (full, once). Fix anything axe flags.
- [ ] Set `GITHUB_FEED_REPOS` on Vercel (production) before push. Flag to Alex which repos.
- [ ] Push `main` (Vercel + Strapi Cloud build).

### Task 8: Production content (after Strapi Cloud has the fields)
All prose through `writing-prose-like-a-human` first. Write as drafts; publish after Alex reviews.
- [ ] Services: create S/01 Architecture Review; update `q6a5…` (S/02), `rhxz…` (S/03 Build & Migrate), `fryn…` (S/04 Fractional Technical Lead) with deliverables/nextSteps/sectors/testimonial; unpublish `tt1ns…`.
- [ ] Fixes hub `ctaText` → S/02; steps[1] body → diagnostic order wording.
- [ ] Process phases ×5 rewritten. FAQ: add "How much of your time am I buying?"; soften travel FAQ.
- [ ] Homepage: hero lines, lede, howIWork[1], seo, featuredProject → LibraryOn. Global `availabilityNote`.
- [ ] Projects ×7: `kind: employed`; LibraryOn `responsibility`/`learned` draft + `featured: true`; Strapi + Community Hub `featured: false`.
- [ ] Publish; one `curl -I` on `/services` for `x-vercel-cache`.
