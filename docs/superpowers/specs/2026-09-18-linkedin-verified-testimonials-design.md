# LinkedIn-verified testimonials

Date: 2026-09-18

## Problem

The testimonial carousel showed seven quotes with no way for a reader to check any
of them. Three were abridged LinkedIn recommendations, four were given to me
directly, and nothing on the page distinguished the two. Two public
recommendations (Hannah Gabrielle, Kevin Wiltshire) were missing entirely.

A quote a reader cannot check is worth less than one they can. The site's
credibility rests on evidence being real or absent, so the fix is to mark which
quotes are publicly verifiable, carry their full text, and link to the source.

## Design

### Schema

Two fields added to `testimonial` via `backend/scripts/generate-content-types.mjs`:

- `fullQuote` (text, optional) — the complete recommendation, paragraphs separated
  by blank lines. Absent for quotes given directly, which is what makes the
  disclosure optional rather than conditional on a second flag.
- `linkedinRecommendation` (boolean, default false) — published on the LinkedIn
  recommendations page.

### Link derivation

LinkedIn gives individual recommendations no permalink; they all live on one page
hanging off the profile. So the URL is derived once by
`linkedinRecommendationsUrl()` in `frontend/src/lib/strapi.ts` from the `linkedin`
entry in Global `socialLinks`, and passed into the component as a prop. A missing
LinkedIn social link means no verification link renders, which is the honest
failure mode. Storing the same URL on every flagged testimonial was rejected as
duplication with five places to fix.

### Component

`TestimonialWall.svelte`:

- Stage footer carries two mono controls under the attribution: a `+ Read the full
  recommendation` disclosure and a `Verified on LinkedIn ↗` link. Either can be
  absent.
- The expanded panel is always in the DOM, toggled with `hidden`, so
  `aria-controls` always resolves. Paragraphs render as real `<p>` elements.
- Disclosure state is `openFor: string | null` keyed on `documentId`, so stepping
  along the rail collapses the panel without a reset effect.
- Opening a recommendation sets `running = false`. A 300-word recommendation takes
  longer to read than the 9s interval, and the carousel must not pull it away
  (WCAG 2.2.2). The play control is the only way back.
- The rail marks flagged entries with a 5px square plus a visually-hidden "Public
  LinkedIn recommendation", so the meaning never rests on colour alone.
- `figcaption` stays the last child of `figure`; the provenance controls are
  siblings inside the animated wrapper, not figure children.

### Content

Five LinkedIn recommendations, all flagged, each with `fullQuote` verbatim
including the author's own punctuation and typos. It is their text, not mine to
tidy. The `quote` excerpt is a contiguous passage in every case, verified
programmatically against `fullQuote` rather than by eye.

Backfilled: Stu Collett (2024), Simon Kinghorn (2024), Douglas Radburn (2015).
Added: Hannah Gabrielle (2024), Kevin Wiltshire (2018).

Simon's stored excerpt read "able to give advice" where he wrote "an ability to
give advice". Replaced with his first sentence verbatim.

The four Strapi quotes are untouched: no flag, no full text, rendering as before.
They now read as less substantiated than the five marked ones, which is accurate.

## Consequences

- `getTestimonials` has no explicit sort, so the two new entries land last and the
  British Library recommendations no longer sit together. An `order` field would
  fix it; deliberately out of scope.
- Douglas's stored role is "CTO, PinPoint" while the recommendation dates from 2015
  when he managed me directly. Left as-is, flagged for a decision.

## Testing

- `smoke.e2e.ts` covers the disclosure: initial collapsed state, label flip, panel
  visibility, multiple paragraphs, the pause behaviour, and the link target.
- `a11y.e2e.ts` runs axe over the expanded state, which the per-page sweep misses.
