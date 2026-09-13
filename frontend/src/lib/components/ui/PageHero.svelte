<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		kicker,
		lede,
		title,
		children
	}: {
		kicker: string;
		lede?: string;
		title: Snippet;
		children?: Snippet;
	} = $props();
</script>

<section class="page-hero">
	<p class="kicker mono">{kicker}</p>
	<h1>{@render title()}</h1>
	{#if lede}<p class="lede hero-lede">{lede}</p>{/if}
	{#if children}{@render children()}{/if}
</section>

<style>
	.page-hero {
		padding: 80px 0;
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
</style>
