<script lang="ts">
	import { resolve } from '$app/paths';
	import { vtMorph } from '$lib/vt.svelte';
	import {
		ArticleRow,
		EmptyState,
		MonoLabel,
		NewsletterCta,
		PageHero,
		Seo,
		Tag
	} from '$lib/components';

	let { data, form } = $props();
	let topicFilter = $state('all');

	const articles = $derived(data.articles ?? []);

	const filtered = $derived(
		articles.filter((a) => topicFilter === 'all' || a.topic?.slug === topicFilter)
	);

	const featured = $derived(filtered.find((a) => a.featured) ?? null);
	const archive = $derived(filtered.filter((a) => a !== featured));

	const totalRead = $derived(
		articles.reduce((sum, a) => sum + (parseInt(a.readingTime ?? '', 10) || 0), 0)
	);
</script>

<Seo
	title={`Writing — ${data.global?.name ?? 'Portfolio'}`}
	description="Long-form notes on Strapi, headless architecture, and the decisions that make platforms ship."
/>

<PageHero
	kicker="Writing · Notes from the field"
	lede="Long-form notes on Strapi, headless architecture, and the unglamorous decisions that decide whether a rollout ships. Roughly one piece a month, when I have something to say, not when the calendar tells me to."
>
	{#snippet title()}
		On <span class="accent">the craft.</span>
	{/snippet}

	{#if articles.length}
		<dl class="writing-meta mono">
			<div>
				<dt>posts:</dt>
				<dd>{articles.length}</dd>
			</div>
			{#if totalRead}<div>
					<dt>est. read:</dt>
					<dd>{totalRead} min total</dd>
				</div>{/if}
			<div>
				<dt>last:</dt>
				<dd>{articles[0].date}</dd>
			</div>
		</dl>
	{/if}
</PageHero>

{#if data.topics?.length}
	<div class="topic-filter" role="group" aria-label="Filter articles by topic">
		<span class="filter-label mono" aria-hidden="true">topic:</span>
		<button
			type="button"
			class="filter-tag mono"
			aria-pressed={topicFilter === 'all'}
			onclick={() => (topicFilter = 'all')}>All</button
		>
		{#each data.topics as t (t.documentId)}
			<button
				type="button"
				class="filter-tag mono"
				aria-pressed={topicFilter === t.slug}
				onclick={() => (topicFilter = t.slug)}>{t.name}</button
			>
		{/each}
	</div>
{/if}

{#if filtered.length}
	{#if featured}
		{@const external = Boolean(featured.externalUrl)}
		<!-- External pieces link out to the publisher; internal ones to the slug route. -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a
			href={featured.externalUrl ?? resolve('/writing/[slug]', { slug: featured.slug })}
			target={external ? '_blank' : undefined}
			rel={external ? 'noopener' : undefined}
			class="featured-panel"
		>
			<div class="featured-head">
				<MonoLabel>Latest · Featured</MonoLabel>
				<span class="featured-meta mono"
					>{featured.date}{#if featured.readingTime}
						· {featured.readingTime}{/if}</span
				>
			</div>
			<h2
				style:view-transition-name={vtMorph.slug === featured.slug
					? `title-${featured.slug}`
					: undefined}
				style:view-transition-class="title"
			>
				{featured.title}
			</h2>
			{#if featured.excerpt}<p class="featured-excerpt">{featured.excerpt}</p>{/if}
			<div class="featured-foot">
				{#if featured.topic}<Tag variant="accent">{featured.topic.name}</Tag>{/if}
				{#if external && featured.publisher}
					<span class="featured-publisher mono">{featured.publisher}</span>
				{/if}
				<span class="read-cta"
					>Read piece <span aria-hidden="true">{external ? '↗' : '→'}</span></span
				>
			</div>
		</a>
	{/if}

	{#if archive.length}
		<div class="archive">
			<MonoLabel class="archive-label">Archive</MonoLabel>
			<div class="row-list">
				{#each archive as a, i (a.documentId)}
					<ArticleRow article={a} num={String(archive.length - i).padStart(2, '0')} />
				{/each}
			</div>
		</div>
	{/if}
{:else}
	<EmptyState>
		{#if articles.length}
			Nothing under this topic yet. Try another filter.
		{:else}
			No articles yet. Add some in the Strapi admin.
		{/if}
	</EmptyState>
{/if}

{#if data.global?.newsletterHeading}
	<div class="newsletter-wrap">
		<NewsletterCta
			heading={data.global.newsletterHeading}
			text={data.global.newsletterText}
			{form}
		/>
	</div>
{/if}

<style>
	.writing-meta {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
		margin: 40px 0 0;
		padding-top: 24px;
		border-top: 1px solid var(--line);
		font-size: 12px;
	}

	.writing-meta div {
		display: flex;
		gap: 5px;
	}

	.writing-meta dt {
		color: var(--muted);
	}

	.writing-meta dd {
		margin: 0;
		color: var(--ink);
	}

	.topic-filter {
		display: flex;
		gap: 8px;
		padding-bottom: 24px;
		flex-wrap: wrap;
		align-items: center;
	}

	.filter-label {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.05em;
		margin-right: 8px;
	}

	.filter-tag {
		padding: 4px 10px;
		background: transparent;
		border: 1px solid var(--ink);
		font-size: 11px;
		color: var(--ink);
		cursor: pointer;
		transition:
			background 200ms,
			color 200ms;
	}

	.filter-tag:hover {
		background: var(--panel);
	}

	.filter-tag[aria-pressed='true'] {
		background: var(--ink);
		color: var(--dark-text);
	}

	.featured-panel {
		display: block;
		padding: 40px;
		margin: 0 -24px;
		border-top: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
		background: var(--panel);
		transition: background 200ms ease;
	}

	.featured-panel:hover {
		background: var(--line);
	}

	.featured-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.featured-meta {
		font-size: 11px;
		color: var(--muted);
	}

	.featured-panel h2 {
		font-size: clamp(32px, 4.5vw, 56px);
		font-weight: 600;
		letter-spacing: -0.035em;
		line-height: 1.05;
		max-width: 880px;
	}

	.featured-excerpt {
		font-size: 18px;
		color: var(--ink-2);
		line-height: 1.55;
		margin: 24px 0;
		max-width: 760px;
	}

	.featured-foot {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.featured-publisher {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.read-cta {
		font-size: 14px;
		color: var(--accent);
		font-weight: 500;
	}

	.archive {
		padding-top: 60px;
	}

	:global(.archive-label) {
		margin-bottom: 24px;
	}

	.row-list {
		border-top: 1px solid var(--ink);
	}

	.newsletter-wrap {
		margin-top: 80px;
	}

	@media (max-width: 900px) {
		.featured-panel {
			padding: 28px 24px;
		}
	}
</style>
