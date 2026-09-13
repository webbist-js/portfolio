<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		kicker,
		lede,
		title,
		children,
		aside
	}: {
		kicker: string;
		lede?: string;
		title: Snippet;
		children?: Snippet;
		aside?: Snippet;
	} = $props();
</script>

<section class="page-hero" class:has-aside={aside}>
	<div>
		<p class="kicker mono">{kicker}</p>
		<h1>{@render title()}</h1>
		{#if lede}<p class="lede hero-lede">{lede}</p>{/if}
		{#if children}{@render children()}{/if}
	</div>
	{#if aside}
		<div class="hero-aside">{@render aside()}</div>
	{/if}
</section>

<style>
	.page-hero {
		padding: 80px 0;
	}

	.page-hero.has-aside {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: 64px;
		align-items: center;
	}

	.kicker {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 24px;
	}

	h1 {
		font-size: clamp(52px, 8vw, 120px);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.045em;
	}

	.hero-lede {
		margin-top: 32px;
		max-width: 720px;
		font-size: 19px;
	}

	@media (max-width: 1100px) {
		.page-hero.has-aside {
			grid-template-columns: 1fr;
			gap: 48px;
		}

		.hero-aside {
			max-width: 420px;
		}
	}
</style>
