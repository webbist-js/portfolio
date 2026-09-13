<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Project } from '$lib/strapi';
	import Tag from './Tag.svelte';
	import Metric from './Metric.svelte';

	let { project }: { project: Project } = $props();

	const shortYear = $derived(project.year ? `'${project.year.slice(-2)}` : '');

	const health = $derived(
		[
			'{',
			`  "platform":  "${project.slug.split('-')[0]}",`,
			`  "role":      "${project.role ?? '—'}",`,
			'  "stack":     [',
			...(project.stack ?? '')
				.split('·')
				.map((s) => s.trim())
				.filter(Boolean)
				.map(
					(s, i, arr) =>
						`    "${s.toLowerCase().replace(/\s+/g, '-')}"${i < arr.length - 1 ? ',' : ''}`
				),
			'  ],',
			...project.metrics.map(
				(m) => `  "${m.label.toLowerCase().replace(/\s+/g, '_')}":  "${m.value}",`
			),
			'  "status":    "✓ healthy"',
			'}'
		].join('\n')
	);
</script>

<div class="featured">
	<div class="terminal" aria-hidden="true">
		<div class="term-head">
			<span class="mono term-label">Live · prod</span>
			<span class="stream">
				<span class="dot pulse"></span>
				<span class="mono stream-label">streaming</span>
			</span>
		</div>
		<div class="mono cmd">$ curl {project.slug}.cms/_health</div>
		<pre class="mono">{health}<span class="cursor">▊</span></pre>
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
		{#if project.role}
			<div class="role mono">Role: <span>{project.role}</span></div>
		{/if}
		{#if project.summary}<p class="summary">{project.summary}</p>{/if}
		{#if project.metrics.length}
			<div class="metrics">
				{#each project.metrics as m (m.label)}
					<div class="metric-cell">
						<Metric value={m.value} label={m.label} size="sm" />
					</div>
				{/each}
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

	.terminal {
		background: var(--dark);
		color: var(--dark-text);
		padding: 40px;
		min-height: 460px;
	}

	.term-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.term-label {
		font-size: 10px;
		color: var(--dark-muted);
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.stream {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent-on-dark);
	}

	.stream-label {
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.cmd {
		font-size: 11px;
		color: var(--accent-on-dark);
		margin-top: 8px;
	}

	pre {
		font-size: 12px;
		color: var(--dark-text);
		margin: 14px 0 0;
		line-height: 1.7;
		opacity: 0.95;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}

	.cursor {
		animation: blink 1s steps(2) infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor {
			animation: none;
		}
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

	.role {
		font-size: 12px;
		color: var(--accent);
		margin-top: 14px;
	}

	.role span {
		color: var(--ink);
	}

	.summary {
		font-size: 16px;
		line-height: 1.55;
		color: var(--ink-2);
		margin-top: 24px;
	}

	.metrics {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin-top: 32px;
		border-top: 1px solid var(--line);
	}

	.metric-cell {
		padding: 20px 20px 0 0;
	}

	.metric-cell + .metric-cell {
		border-left: 1px solid var(--line);
		padding-left: 20px;
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

		.terminal {
			min-height: 0;
		}
	}
</style>
