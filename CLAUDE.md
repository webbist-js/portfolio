# CLAUDE.md

## What this is

Personal portfolio of Alex Bennett — independent, hands-on technical lead (enterprise
Strapi / headless architecture, UK · remote). npm-workspaces + Turborepo monorepo:

- `backend/` — Strapi 5 (TS). Dev DB: SQLite (`.tmp/data.db`). Prod: Strapi Cloud at
  `admin.alex-bennett.co.uk`. Schemas are GENERATED — edit
  `backend/scripts/generate-content-types.mjs` and re-run it; never hand-edit
  `schema.json`. Public read + form-create permissions auto-grant on boot
  (`backend/src/index.ts`). **Every schema change needs the MCP admin tokens
  updated** (Cloud: `/admin/settings/admin-tokens`; local: rerun
  `scripts/create-mcp-token.cjs`): admin-token permissions carry a per-field
  list frozen at creation, and the built-in MCP builds its tool schemas from it,
  so new fields are rejected as "Unrecognized keys" until the token is re-saved.
  Ship a new relation's schema and confirm `populate` works on Cloud BEFORE
  pushing a frontend that reads it (ISR pages 500 on cache miss otherwise). Content scripts (`seed.cjs`, `migrate-*.cjs`) are
  local-only (gitignored) and need the dev server STOPPED (SQLite lock).
- `frontend/` — SvelteKit, Svelte 5 runes, TS. Prod: Vercel at
  `www.alex-bennett.co.uk`. DS components in `src/lib/components/ui/` (barrel
  `index.ts`), tokens in `src/lib/styles/tokens.css`, typed CMS client
  `src/lib/strapi.ts`. Build-time env (`$env/static/public`): `PUBLIC_STRAPI_URL`,
  `PUBLIC_SITE_URL` — both must exist or the build fails.

Design language: paper `#FAFAF7`, ink `#0E0E0E`, accent blue; Inter / JetBrains Mono /
Newsreader italic; sharp corners, 1px ink borders. Conventions: heading kickers are
mono + `--muted` (never accent); page-ending CTA bands are the dark variant with
accent-blue primary buttons (paper-invert hover); small text uses `--muted`
(`#7a7a75` fails AA); axe WCAG 2.2 AA runs in e2e — keep aria/labels intact.

Content rules: no prices anywhere (rates on request), no specific location ("UK ·
Remote"), anonymised case studies stay DRAFT until contracts are checked, no
framework-specific positioning (not Next.js-only). Content edits go through the
Strapi admin or MCP (`strapi-local` for dev), not seed re-runs.

## Tone of voice — all site copy

The voice is established across the live site; match it, don't reinvent it.

- **One engineer, first person, UK English** (modelling, organisational, fortnight).
  Speak directly to a technical buyer's problem in second person: "Your Strapi build
  is slow… I find out why, and fix it."
- **Short declaratives, deliberate fragments** for rhythm ("They are not original.
  They're earned."). Expand with a colon or parenthetical aside — never em dashes in
  prose (reads as AI). Full sentences over bullet fragments in body copy.
- **Specificity over adjectives.** Concrete numbers, named tools, real scenarios
  ("reasonable at ten content types and stop being reasonable at four hundred").
  No hype words (seamless, robust, cutting-edge), no exclamation marks, no
  superlatives that can't be evidenced. Evidence is real or absent, never invented.
- **Candour is the credibility mechanism.** Admit the unglamorous and the limits:
  "the ones going well and the ones that aren't", "boring infrastructure", case
  studies "abridged where confidentiality requires", availability stated plainly.
- **Diagnostic stance, not tutorial stance** (fixes + writing): symptom → likely
  causes most-to-least common → how to confirm → fix. Always "prove it before you
  change anything"; warn against fixes that hide problems ("Do this before you add
  Redis").
- **Positioning constants**: hands-on, no agency overhead, knowledge transfer over
  dependency ("the team owns it"), a small number of engagements, day job at Strapi
  is separate and cleared. Never contradict these.
- **Mechanics**: page/SEO titles are keyword-first; kickers and micro-labels are
  terse mono fragments (S/01, F/01, "live · 11 min"); CTAs are short imperatives
  ("Book a call", "Read the full case study").

### Humanising gate — MANDATORY before any copy reaches Strapi

Invoke the `writing-prose-like-a-human` skill and apply it to EVERY piece of prose
before it is written to the CMS (articles, fix pages, services, homepage, SEO
descriptions). This is a gate, not a suggestion: run it on the draft, fix what it
flags, then create/update the document. Never publish copy that has not been through
it. The same applies to edits — re-run it on anything you rewrite.

Three failure modes it catches that the tone-of-voice rules above do not:

- **Significance inflation.** Telling the reader a thing matters instead of letting
  it matter ("this is the paragraph that decides whether the rest pays off"). State
  the fact and stop. No section ends on a summary or a why-this-matters sentence.
- **Trailing participial commentary.** "The population grew 12%, reflecting broader
  trends." End the sentence at the fact.
- **Template sameness ACROSS pieces.** The per-article check passes and the set still
  reads as generated, because every piece shares a skeleton (steelman → data →
  "two things are being confused" → bold-label action list → CTA). When writing more
  than one article, diff the structures and deliberately break the symmetry: vary
  section counts, vary the closing device, and do not reuse the same CTA construction
  twice. Reserve `**Bold label.** explanation` lists for genuinely list-shaped
  content, and not in every piece.

Audit mechanically as well as by eye. Grep the draft for the skill's watchlist
(pivotal, crucial, testament, delve, intricate, underscore, showcase, foster,
leverage, navigate, robust, seamless, comprehensive, serves as, stands as, boasts),
for `Additionally`/`Furthermore`/`Moreover` as sentence openers, for curly quotes,
and for em dashes (target zero — see the house rule above). Check sentence-length
variance rather than assuming it: a standard deviation near 8 words on a mean near
14, with plenty of sentences under eight words, is the shape to aim for.

## Working rules — keep tokens low, work fast

- **Test tiers**: after code edits run only `npm run check` (+ a targeted curl/grep
  of the affected route). `npm run lint` before committing. The FULL Playwright
  e2e + axe suite runs ONLY once, immediately before push/deploy. Never run e2e for
  content or copy-only changes; docs-only changes skip all gates.
- Dev servers are usually already running (Strapi :1337, frontend :5173) — curl
  before booting anything. Don't rebuild/restart Strapi unless backend schema/code
  changed.
- Node 24 lives at `~/.nvm/versions/node/v24.21.0/bin` — prefix PATH in shells (login
  shells may still resolve Node 20). Use `npm ci`, never `npm install`, when deps are
  unchanged (avoids the nested-optional-deps prune bug).
- The rtk shell hook breaks bare `npx` and PATH inside shell loops: use
  `rtk proxy npx …` or npm scripts, and python3 heredocs instead of shell loops.
- Prefer targeted Edits + svelte-check over screenshots; screenshot only when the
  user asked for visual work.
- Commits: concise, no Co-Authored-By. Push only when deploying (push triggers
  Vercel + Strapi Cloud builds).
