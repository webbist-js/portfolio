# Review actions: delivery model, services, evidence

Date: 2026-09-23

## Problem

An external review of the live site found the credentials stronger than the
offer. Four services overlap, the full-time Strapi role sits unresolved against
8–16 week project framing, case studies list roles rather than outcomes, and a
few details undercut a site selling precision: a simulated `_health` terminal, an
unfiltered GitHub feed that surfaced a wedding commit, "likelihood" bars with no
data behind them, and a "Book a call" button that opens a form.

Decisions taken: independent work is part-time, outside core hours, fixed-scope or
advisory; services regroup into three purchasing situations plus a small
Architecture Review; the CTA is renamed rather than wired to a scheduler; the
terminal becomes a dossier panel built from CMS data.

## Design

### Schema (`backend/scripts/generate-content-types.mjs`)

- `service`: `deliverables` (text), `nextSteps` (text), `sectors` (string),
  `testimonial` (oneToOne → testimonial).
- `project`: `kind` (enum `employed | independent`, default `employed`),
  `responsibility` (text), `learned` (text).
- `article`: `updated` (date, optional). Set by hand for substantive revisions;
  `updatedAt` stays JSON-LD `dateModified` only.

All new fields optional. The frontend renders against the old schema until
Strapi Cloud redeploys.

### Services (production content)

| Code | Name | documentId | Format · typical |
|---|---|---|---|
| S/01 | Architecture Review (new) | create | Fixed scope · 1–2 weeks |
| S/02 | Performance & Architecture Rescue | `q6a5jwcboch55bbzmbz6vs83` kept | Diagnostic fixed; remediation agreed after |
| S/03 | Build & Migrate | `rhxzvom9aycco1vjgqrlsnfs` renamed | Phased · part-time |
| S/04 | Fractional Technical Lead | `frynetb3woxfa0ea5xhgkz13` renamed | Retained · hours per week |

Public Sector & Accessible Delivery (`tt1ns6s70834mz6yr9lulrqy`) unpublished;
its substance moves to `sectors` on each card and one line in the services hero.
Fixes-hub `ctaText` references S/02. Testimonials: Rescue → Rosie Hackett,
Review → Raul Balestra, Build → Simon Kinghorn, Fractional Lead → Stu Collett.

Process phases rewritten for part-time delivery (no "embedded", no "on-call
shadowing"). New FAQ: "How much of your time am I buying?" Travel FAQ softened.

### Homepage and Global (production content)

- `heroHeadline` "I build enterprise Strapi platforms." `heroAccent` "And fix
  the ones already in trouble." `heroHighlight` "already in trouble".
- Lede: independent technical lead, part-time and fixed-scope, day job separate.
- `howIWork[1]` replaced: judgment over headcount; AI-assisted named as tooling,
  no "team of three".
- SEO title keyword-first. `availabilityNote` "part-time slots from Q4 2026".
- `featuredProject` → LibraryOn (`whfxvhqrs31ind323vbfj0xi`).

### Work

All seven production projects `kind: employed`. Rows and case-study headers carry
a mono label ("Employed role" / "Independent engagement"). Work-page stats:
projects · years active · featured. Case study renders Challenge, My
responsibility, Approach, Outcome, What I learned. LibraryOn expanded and
featured; Strapi and Community Hub un-featured. LibraryOn `responsibility` and
`learned` are drafted from published facts and left for Alex to confirm; nothing
is invented.

### Frontend

- `FeaturedCaseCard`: dossier panel (role, responsibility, stack tags, metrics)
  replaces the terminal. Real content, so no `aria-hidden`.
- `lib/server/github.ts`: commits filtered to `GITHUB_FEED_REPOS`
  (comma-separated `owner/repo`). Unset → no commits.
- CTA label "Request a call" everywhere; modal copy states the 48-hour reply.
- `FixCauses`: label "Likely causes · the order I check them", barnote "bars =
  diagnostic order from experience, not measured frequency", hidden text
  matches. Hub step copy updated in CMS.
- Article header shows "Updated {date}" when `updated` is set.
- `ServiceCard` renders deliverables, next steps, sectors, linked testimonial.
- Hardcoded sub-copy on home and services mentions part-time.
- `e2e/pages.ts` markers checked against renamed content.

### Delivery

Branch → schema + frontend → `npm run check` + curl → local content via
`strapi-local` to eyeball → `npm run lint` → full e2e + axe once → set
`GITHUB_FEED_REPOS` on Vercel → push → production content via `my-website` MCP
as drafts (JSON-RPC to `/mcp` if the tool schema is cached) → publish → one
`x-vercel-cache` check.

## Out of scope

Reviewer's verbatim copy; softening the agents article; LibraryOn metrics; a
scheduler; the "Strapi" job-title tag.
