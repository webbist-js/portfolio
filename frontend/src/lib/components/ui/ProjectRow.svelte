<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Project } from '$lib/strapi';

	let { project, num }: { project: Project; num: string } = $props();

	const shortYear = $derived(project.year ? `'${project.year.slice(-2)}` : '');
</script>

<a href={resolve('/work/[slug]', { slug: project.slug })} class="index-row">
	<span class="num mono" aria-hidden="true">{num}</span>
	<span class="main">
		<span class="name" style:view-transition-name={`title-${project.slug}`}>{project.name}</span>
		<span class="meta mono">
			{#if project.client}{project.client}{/if}{#if project.client && project.role}
				·
			{/if}{#if project.role}{project.role}{/if}
		</span>
	</span>
	<span class="summary">{project.summary ?? ''}</span>
	<span class="stack mono">{project.stack ?? ''}</span>
	<span class="year mono">{shortYear}</span>
	<span class="arrow" aria-hidden="true">→</span>
</a>

<style>
	.index-row {
		display: grid;
		grid-template-columns: 40px 1.2fr 1.5fr 200px 50px 24px;
		gap: 24px;
		align-items: center;
		padding: 28px 24px;
		margin: 0 -24px;
		border-bottom: 1px solid var(--line);
		transition: background 200ms ease;
	}

	.index-row:hover {
		background: var(--panel);
	}

	.num {
		font-size: 11px;
		color: var(--muted);
	}

	.name {
		display: block;
		font-size: 24px;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.meta {
		display: block;
		font-size: 11px;
		color: var(--muted);
		margin-top: 4px;
	}

	.summary {
		font-size: 14px;
		color: var(--ink-2);
		line-height: 1.45;
		padding-right: 24px;
	}

	.stack {
		font-size: 11px;
		color: var(--ink);
	}

	.year {
		font-size: 12px;
		color: var(--muted);
		text-align: right;
	}

	.arrow {
		font-size: 18px;
		color: var(--muted);
		transition:
			transform 280ms var(--ease-out),
			color 200ms;
	}

	.index-row:hover .arrow,
	.index-row:focus-visible .arrow {
		transform: translateX(8px);
		color: var(--accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.index-row:hover .arrow,
		.index-row:focus-visible .arrow {
			transform: none;
		}
	}

	@media (max-width: 900px) {
		.index-row {
			grid-template-columns: 40px 1fr 24px;
		}

		.summary,
		.stack,
		.year {
			display: none;
		}
	}
</style>
