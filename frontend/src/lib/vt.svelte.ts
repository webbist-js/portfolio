/**
 * Which slug's title should morph during the active view transition.
 * Set by +layout.svelte's onNavigate before the old page is captured and
 * cleared when the transition finishes. Rows/cards only carry a
 * view-transition-name while they are the morph target — naming every row
 * all the time makes each one snapshot separately and fade over the
 * incoming page as a detached ghost.
 */
export const vtMorph = $state<{ slug: string | null }>({ slug: null });
