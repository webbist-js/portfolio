<script lang="ts">
	import type { Pillar } from '$lib/strapi';

	let { pillars }: { pillars: Pillar[] } = $props();
</script>

<div class="pillar-grid">
	{#each pillars as pillar, i (pillar.title)}
		<div class="pillar">
			<span class="index mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
			<h3>{pillar.title}</h3>
			<p>{pillar.body}</p>
		</div>
	{/each}
</div>

<style>
	.pillar-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border-top: 1px solid var(--ink);
		border-left: 1px solid var(--ink);
	}

	.pillar {
		padding: 36px;
		border-right: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
		background: var(--white);
	}

	.index {
		display: block;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.1em;
		margin-bottom: 20px;
	}

	h3 {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.15;
		margin-bottom: 14px;
	}

	p {
		font-size: 14px;
		line-height: 1.6;
		color: var(--ink-3);
	}

	@media (max-width: 900px) {
		.pillar-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
