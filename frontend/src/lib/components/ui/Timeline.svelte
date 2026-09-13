<script lang="ts">
	import type { Experience } from '$lib/strapi';
	import Tag from './Tag.svelte';

	let { experiences }: { experiences: Experience[] } = $props();
</script>

<ol class="timeline">
	{#each experiences as e, i (e.documentId)}
		<li>
			<span class="years mono">{e.years}</span>
			<span class="node" class:current={i === 0} aria-hidden="true"></span>
			<div>
				<h3>{e.role}</h3>
				{#if e.organisation}<div class="org mono">@ {e.organisation}</div>{/if}
				{#if e.description}<p class="note">{e.description}</p>{/if}
				{#if e.stack.length}
					<div class="stack">
						{#each e.stack as t (t.label)}
							<Tag class="small">{t.label}</Tag>
						{/each}
					</div>
				{/if}
			</div>
		</li>
	{/each}
</ol>

<style>
	.timeline {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--ink);
		position: relative;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 139px;
		top: 32px;
		bottom: 32px;
		width: 1px;
		background: var(--line);
	}

	li {
		display: grid;
		grid-template-columns: 160px 1fr;
		gap: 32px;
		padding: 32px 0;
		border-bottom: 1px solid var(--line);
		position: relative;
	}

	.years {
		font-size: 12px;
		color: var(--accent);
	}

	.node {
		position: absolute;
		left: 135px;
		top: 38px;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--ink);
		border: 2px solid var(--paper);
		box-shadow: 0 0 0 1px var(--ink);
	}

	.node.current {
		background: var(--accent);
		box-shadow: 0 0 0 1px var(--accent);
	}

	h3 {
		font-size: 20px;
		font-weight: 600;
		letter-spacing: -0.015em;
		line-height: 1.2;
	}

	.org {
		font-size: 12px;
		color: var(--muted);
		margin-top: 4px;
	}

	.note {
		font-size: 14px;
		color: var(--ink-3);
		margin-top: 12px;
		line-height: 1.55;
	}

	.stack {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 12px;
	}

	.stack :global(.tag.small) {
		font-size: 10px;
		padding: 3px 8px;
	}

	@media (max-width: 720px) {
		.timeline::before,
		.node {
			display: none;
		}

		li {
			grid-template-columns: 1fr;
			gap: 8px;
		}
	}
</style>
