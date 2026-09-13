# CLAUDE.md

## What this is

Personal portfolio of Alex Bennett — independent, hands-on technical lead (enterprise
Strapi / headless architecture, UK · remote). npm-workspaces + Turborepo monorepo:

- `backend/` — Strapi 5 (TS). Dev DB: SQLite (`.tmp/data.db`). Prod: Strapi Cloud at
  `admin.alex-bennett.co.uk`. Schemas are GENERATED — edit
  `backend/scripts/generate-content-types.mjs` and re-run it; never hand-edit
  `schema.json`. Public read + form-create permissions auto-grant on boot
  (`backend/src/index.ts`). Content scripts (`seed.cjs`, `migrate-*.cjs`) are
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
