<script lang="ts">
	import { resolve } from '$app/paths';
	import { MetricStrip, MonoLabel, Tag } from '$lib/components';

	let { data } = $props();
	const p = $derived(data.project);

	const shortYear = $derived(p.year ? `'${p.year.slice(-2)}` : '');

	const sections = $derived(
		(
			[
				['Challenge', p.challenge],
				['Approach', p.approach],
				['Outcome', p.outcome]
			] as const
		).filter(([, body]) => Boolean(body))
	);
</script>

<svelte:head>
	<title>{p.name} — {data.global?.name ?? 'Portfolio'}</title>
	{#if p.summary}<meta name="description" content={p.summary} />{/if}
</svelte:head>

<article>
	<header class="case-head">
		<a href={resolve('/work')} class="link crumb mono"><span aria-hidden="true">←</span> All work</a
		>
		<div class="tags">
			{#if p.role}<Tag variant="accent">{p.role}</Tag>{/if}
			{#if p.client}<Tag>{p.client}</Tag>{/if}
			{#if p.year}<Tag>{shortYear}</Tag>{/if}
		</div>
		<h1>{p.name}</h1>
		{#if p.stack}<div class="stack mono">{p.stack}</div>{/if}
		{#if p.summary}<p class="lede case-lede">{p.summary}</p>{/if}
	</header>

	<MetricStrip metrics={p.metrics} size="lg" />

	{#if sections.length}
		<div class="body-sections">
			{#each sections as [label, body], i (label)}
				<section class="body-section">
					<div>
						<MonoLabel tone="accent">§ {String(i + 1).padStart(2, '0')}</MonoLabel>
						<h2>{label}</h2>
					</div>
					<p>{body}</p>
				</section>
			{/each}
		</div>
	{/if}

	{#if p.tags.length}
		<section class="tags-section">
			<MonoLabel class="tags-label">What I worked on</MonoLabel>
			<div class="tag-cloud">
				{#each p.tags as tag (tag.label)}<Tag>{tag.label}</Tag>{/each}
			</div>
		</section>
	{/if}

	{#if data.next}
		<section class="next-section">
			<a href={resolve('/work/[slug]', { slug: data.next.slug })} class="next-row">
				<span class="next-label mono">NEXT <span aria-hidden="true">→</span></span>
				<span class="next-main">
					<span class="next-name">{data.next.name}</span>
					{#if data.next.client}
						<span class="next-meta mono"
							>{data.next.client}{#if data.next.role}
								· {data.next.role}{/if}</span
						>
					{/if}
				</span>
				{#if data.next.stack}<span class="next-stack mono">{data.next.stack}</span>{/if}
				<span class="next-arrow" aria-hidden="true">→</span>
			</a>
		</section>
	{/if}
</article>

<style>
	.case-head {
		padding: 60px 0 40px;
	}

	.crumb {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.tags {
		display: flex;
		gap: 8px;
		margin-top: 28px;
		flex-wrap: wrap;
	}

	h1 {
		font-size: clamp(48px, 7vw, 96px);
		font-weight: 600;
		letter-spacing: -0.045em;
		line-height: 1;
		margin-top: 24px;
	}

	.stack {
		font-size: 13px;
		color: var(--accent);
		margin-top: 20px;
	}

	.case-lede {
		margin-top: 24px;
		max-width: 760px;
		font-size: 19px;
	}

	.body-sections {
		padding-top: 40px;
	}

	.body-section {
		display: grid;
		grid-template-columns: 180px 1fr;
		gap: 56px;
		padding: 40px 0;
	}

	.body-section + .body-section {
		border-top: 1px solid var(--line);
	}

	h2 {
		font-size: 36px;
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1;
		margin-top: 12px;
	}

	.body-section p {
		font-size: 18px;
		line-height: 1.55;
		color: var(--ink-2);
		max-width: 720px;
	}

	.tags-section {
		padding: 32px 0 60px;
		border-top: 1px solid var(--line);
	}

	:global(.tags-label) {
		margin-bottom: 16px;
	}

	.tag-cloud {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.next-section {
		border-top: 1px solid var(--ink);
		padding: 40px 0;
	}

	.next-row {
		display: grid;
		grid-template-columns: 80px 1.2fr auto 24px;
		gap: 24px;
		align-items: center;
		padding: 32px 24px;
		margin: 0 -24px;
		transition: background 200ms ease;
	}

	.next-row:hover {
		background: var(--panel);
	}

	.next-label {
		font-size: 11px;
		color: var(--accent);
		letter-spacing: 0.1em;
	}

	.next-name {
		display: block;
		font-size: 28px;
		font-weight: 600;
		letter-spacing: -0.025em;
	}

	.next-meta {
		display: block;
		font-size: 11px;
		color: var(--muted);
		margin-top: 4px;
	}

	.next-stack {
		font-size: 11px;
		color: var(--ink);
	}

	.next-arrow {
		font-size: 22px;
		color: var(--accent);
		transition: transform 280ms var(--ease-out);
	}

	.next-row:hover .next-arrow {
		transform: translateX(8px);
	}

	@media (prefers-reduced-motion: reduce) {
		.next-row:hover .next-arrow {
			transform: none;
		}
	}

	@media (max-width: 900px) {
		.body-section {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.next-row {
			grid-template-columns: 1fr 24px;
		}

		.next-label,
		.next-stack {
			display: none;
		}
	}
</style>
