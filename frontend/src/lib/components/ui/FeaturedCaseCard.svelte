<script lang="ts">
	import { resolve } from '$app/paths';
	import { projectKindLabel, type Project } from '$lib/strapi';
	import Tag from './Tag.svelte';
	import Metric from './Metric.svelte';

	let { project }: { project: Project } = $props();

	const shortYear = $derived(project.year ? `'${project.year.slice(-2)}` : '');

	const stack = $derived(
		(project.stack ?? '')
			.split('·')
			.map((s) => s.trim())
			.filter(Boolean)
	);
</script>

<div class="featured">
	<!-- Dossier: the facts of the engagement, from the CMS. It replaced a
	     simulated health-check terminal, which read as fabricated evidence. -->
	<div class="dossier">
		<div class="dossier-head">
			<span class="mono dossier-label">Case file</span>
			<span class="mono dossier-label">{projectKindLabel(project.kind)}</span>
		</div>
		<dl class="mono">
			{#if project.role}
				<div class="row">
					<dt>Role</dt>
					<dd>{project.role}</dd>
				</div>
			{/if}
			{#if project.client}
				<div class="row">
					<dt>Organisation</dt>
					<dd>
						{project.client}{#if shortYear}
							· {shortYear}{/if}
					</dd>
				</div>
			{/if}
			{#if project.responsibility}
				<div class="row">
					<dt>Owned</dt>
					<dd class="sans">{project.responsibility}</dd>
				</div>
			{/if}
			{#if stack.length}
				<div class="row">
					<dt>Stack</dt>
					<dd class="stack">
						{#each stack as s (s)}<span class="chip">{s}</span>{/each}
					</dd>
				</div>
			{/if}
		</dl>
		{#if project.metrics.length}
			<div class="metrics">
				{#each project.metrics as m (m.label)}
					<div class="metric-cell">
						<Metric value={m.value} label={m.label} size="sm" />
					</div>
				{/each}
			</div>
		{/if}
	</div>
	<div class="content">
		<div class="tags">
			<Tag variant="accent">Featured</Tag>
			{#if project.stack}<Tag>{project.stack}</Tag>{/if}
		</div>
		{#if project.client}
			<div class="client mono">
				{project.client}{#if project.year}
					· {shortYear}{/if}
			</div>
		{/if}
		<h3>{project.name}</h3>
		{#if project.summary}<p class="summary">{project.summary}</p>{/if}
		{#if project.outcome}
			<div class="outcome">
				<span class="outcome-label mono">Outcome</span>
				<p>{project.outcome}</p>
			</div>
		{/if}
		<a href={resolve('/work/[slug]', { slug: project.slug })} class="link accent read-more"
			>Read the full case study <span aria-hidden="true">→</span></a
		>
	</div>
</div>

<style>
	.featured {
		display: grid;
		grid-template-columns: 1fr 1.3fr;
		border: 1px solid var(--ink);
		background: var(--white);
		overflow: hidden;
	}

	.dossier {
		background: var(--dark);
		color: var(--dark-text);
		padding: 40px;
		min-height: 460px;
		display: flex;
		flex-direction: column;
	}

	.dossier-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 28px;
	}

	.dossier-label {
		font-size: 10px;
		color: var(--dark-muted);
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	dl {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 18px;
		font-size: 12px;
	}

	.row {
		display: grid;
		grid-template-columns: 96px 1fr;
		gap: 16px;
		align-items: start;
	}

	dt {
		color: var(--dark-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 10px;
		padding-top: 2px;
	}

	dd {
		margin: 0;
		color: var(--dark-text);
		line-height: 1.6;
	}

	dd.sans {
		font-family: var(--font-sans);
		font-size: 14px;
		color: var(--dark-soft);
	}

	.stack {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.chip {
		font-size: 11px;
		padding: 2px 8px;
		border: 1px solid var(--dark-muted);
		color: var(--dark-text);
	}

	.metrics {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0 24px;
		margin-top: auto;
		padding-top: 28px;
		border-top: 1px solid var(--dark-muted);
	}

	.metrics :global(.metric) {
		color: var(--dark-text);
	}

	.metrics :global(.metric .label) {
		color: var(--dark-muted);
	}

	.content {
		padding: 40px;
	}

	.tags {
		display: flex;
		gap: 8px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.client {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.05em;
		margin-bottom: 12px;
	}

	h3 {
		font-size: clamp(30px, 3.5vw, 44px);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.summary {
		font-size: 16px;
		line-height: 1.55;
		color: var(--ink-2);
		margin-top: 24px;
	}

	.outcome {
		margin-top: 28px;
		padding-top: 20px;
		border-top: 1px solid var(--line);
	}

	.outcome-label {
		display: block;
		font-size: 10px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 8px;
	}

	.outcome p {
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink-2);
	}

	.read-more {
		display: inline-block;
		margin-top: 28px;
		font-size: 14px;
		font-weight: 500;
	}

	@media (max-width: 900px) {
		.featured {
			grid-template-columns: 1fr;
		}

		.dossier {
			min-height: 0;
		}
	}
</style>
