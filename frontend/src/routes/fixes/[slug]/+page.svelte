<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button, CtaBand, FixBlocks, Prose, Seo } from '$lib/components';

	let { data } = $props();
	const page = $derived(data.fixPage);

	const byline = $derived(
		`Written by ${data.global?.name ?? 'Alex Bennett'}. Personal site; my own views, not official Strapi documentation.` +
			(page.reviewed
				? ` Last reviewed ${page.reviewed}${page.reviewedAgainst ? ` · ${page.reviewedAgainst}` : ''}.`
				: '')
	);
</script>

<Seo
	title={page.seoTitle ?? `${page.title} — ${data.global?.name ?? 'Portfolio'}`}
	description={page.seoDescription ?? page.lede ?? page.title}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: page.title,
		description: page.seoDescription ?? undefined,
		dateModified: page.updatedAt?.slice(0, 10),
		author: { '@type': 'Person', name: data.global?.name ?? 'Alex Bennett' }
	}}
/>

<article class="fix">
	<header class="fix-head">
		<a href={resolve('/fixes')} class="link crumb mono"
			><span aria-hidden="true">←</span> All fixes</a
		>
		<div class="meta mono">
			{#if data.fixCode}<span class="accent">{data.fixCode}</span>{/if}
			{#if page.readingTime}<span aria-hidden="true">·</span><span>{page.readingTime} read</span
				>{/if}
			{#if page.reviewed}<span aria-hidden="true">·</span><span
					>reviewed {page.reviewed}{#if page.reviewedAgainst}
						· {page.reviewedAgainst}{/if}</span
				>{/if}
		</div>
		<h1 style:view-transition-name={`title-${page.slug}`} style:view-transition-class="title">
			{page.title}
		</h1>
		{#if page.lede}
			<div class="tldr grid-bg">
				<span class="tldr-label mono">TL;DR</span>
				<div class="tldr-body"><Prose text={page.lede} /></div>
			</div>
		{/if}
	</header>

	<div class="fix-body">
		<FixBlocks blocks={page.blocks ?? []} />
	</div>

	{#if page.service}
		<div class="cta-wrap">
			<CtaBand
				tone="dark"
				kicker={page.ctaKicker ?? 'Need this diagnosed on your own project?'}
				title={`${page.service.code ? `${page.service.code} — ` : ''}${page.service.name}.`}
				text={page.ctaText}
			>
				<Button href={resolve('/services')} variant="accent"
					>{page.ctaLabel ?? 'See the service'} <span aria-hidden="true">→</span></Button
				>
			</CtaBand>
		</div>
	{/if}

	<footer class="fix-foot">
		<p class="byline mono">{byline}</p>
	</footer>
</article>

<style>
	.fix-head {
		padding: 48px 0 64px;
	}

	.crumb {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.meta {
		display: flex;
		gap: 10px;
		align-items: baseline;
		flex-wrap: wrap;
		margin-top: 28px;
		font-size: 12px;
		color: var(--muted);
	}

	h1 {
		font-size: clamp(44px, 6.5vw, 96px);
		font-weight: 600;
		letter-spacing: -0.045em;
		line-height: 1.02;
		margin-top: 20px;
		max-width: 1080px;
	}

	.tldr {
		display: grid;
		grid-template-columns: 110px minmax(0, 1fr);
		gap: 24px;
		align-items: start;
		background: var(--dark);
		color: var(--dark-text);
		padding: 32px;
		margin-top: 48px;
		max-width: 880px;
	}

	.tldr-label {
		font-size: 11px;
		color: var(--accent-on-dark);
		letter-spacing: 0.14em;
	}

	.tldr-body :global(.prose) {
		font-size: 16px;
		line-height: 1.65;
		color: var(--dark-text);
		margin-bottom: 12px;
	}

	.tldr-body :global(.prose:last-child) {
		margin-bottom: 0;
	}

	.tldr-body :global(code) {
		background: transparent;
		border: 0;
		padding: 0;
		color: var(--dark-soft);
	}

	.fix-foot {
		margin-top: 40px;
		padding-bottom: 8px;
	}

	.byline {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.03em;
		line-height: 1.7;
	}

	.cta-wrap {
		margin-top: 72px;
	}

	@media (max-width: 700px) {
		.tldr {
			grid-template-columns: 1fr;
			gap: 12px;
			padding: 24px;
		}
	}
</style>
