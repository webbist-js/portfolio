<script lang="ts">
	import type { ArticleBlock } from '$lib/strapi';
	import { mediaUrl } from '$lib/strapi';
	import CodeBlock from './CodeBlock.svelte';
	import Prose from './Prose.svelte';

	let { blocks }: { blocks: ArticleBlock[] } = $props();

	// Only prose sections get an index number; quotes/code/images sit between.
	const numbered = $derived.by(() => {
		let n = 0;
		return blocks.map((block) => ({
			block,
			num: block.__component === 'article.section' ? String(++n).padStart(2, '0') : null
		}));
	});
</script>

{#each numbered as { block, num } (block.__component + block.id)}
	{#if block.__component === 'article.section'}
		<section class="prose-section">
			<p class="label mono" aria-hidden="true">
				<span class="num">{num}</span>{#if block.kicker}
					· <span class="kick">{block.kicker}</span>{/if}
			</p>
			<h2>{block.heading}</h2>
			<Prose text={block.body} />
		</section>
	{:else if block.__component === 'article.quote'}
		<blockquote class="quote serif">
			<p>{block.text}</p>
			{#if block.attribution}<footer class="mono">— {block.attribution}</footer>{/if}
		</blockquote>
	{:else if block.__component === 'article.callout'}
		<aside class="callout">
			<span class="callout-icon" aria-hidden="true">
				{#if block.variant === 'warning'}
					<svg
						viewBox="0 0 16 16"
						width="17"
						height="17"
						fill="none"
						stroke="currentColor"
						stroke-width="1.4"
					>
						<path d="M8 1.7 15 14H1L8 1.7Z" stroke-linejoin="round" />
						<path d="M8 6.4v3.2" stroke-linecap="round" />
						<circle cx="8" cy="11.6" r="0.45" fill="currentColor" stroke="none" />
					</svg>
				{:else}
					<svg
						viewBox="0 0 16 16"
						width="17"
						height="17"
						fill="none"
						stroke="currentColor"
						stroke-width="1.4"
					>
						<circle cx="8" cy="8" r="6.6" />
						<path d="M8 7.2v3.6" stroke-linecap="round" />
						<circle cx="8" cy="4.9" r="0.5" fill="currentColor" stroke="none" />
					</svg>
				{/if}
			</span>
			<div class="callout-main">
				{#if block.label}<p class="callout-label mono">{block.label}</p>{/if}
				<Prose text={block.body} />
			</div>
		</aside>
	{:else if block.__component === 'article.code'}
		<CodeBlock code={block.code} language={block.language} title={block.title} />
	{:else if block.__component === 'article.image'}
		{@const src = mediaUrl(block.image)}
		{#if src}
			<figure>
				<img
					{src}
					alt={block.image?.alternativeText ?? block.caption ?? ''}
					width={block.image?.width}
					height={block.image?.height}
					loading="lazy"
				/>
				{#if block.caption}<figcaption class="mono">{block.caption}</figcaption>{/if}
			</figure>
		{/if}
	{/if}
{/each}

<style>
	.prose-section {
		margin-top: 56px;
	}

	/* First block sits directly under the article header; drop its top
	   spacing so it doesn't stack with the header's bottom padding. */
	.prose-section:first-child,
	.callout:first-child,
	.quote:first-child,
	figure:first-child {
		margin-top: 0;
	}

	.label {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 14px;
	}

	.label .num {
		color: var(--accent);
	}

	.label .kick {
		color: var(--muted);
	}

	.prose-section h2 {
		font-size: clamp(23px, 2.3vw, 27px);
		font-weight: 600;
		letter-spacing: -0.025em;
		line-height: 1.15;
		margin-bottom: 20px;
	}

	.callout {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr);
		gap: 14px;
		align-items: start;
		background: var(--panel);
		border: 1px solid var(--line);
		padding: 20px 22px;
		margin: 44px 0;
	}

	.callout-icon {
		display: flex;
		color: var(--accent);
		padding-top: 1px;
	}

	.callout-label {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 8px;
	}

	.callout-main :global(.prose) {
		font-size: 14px;
		line-height: 1.65;
		color: var(--ink-3);
	}

	.quote {
		margin: 56px 0;
		padding-left: 28px;
		border-left: 3px solid var(--accent);
		font-size: 26px;
		line-height: 1.35;
		letter-spacing: -0.01em;
	}

	.quote p {
		margin: 0;
	}

	.quote footer {
		font-style: normal;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-top: 16px;
	}

	figure {
		margin: 40px 0;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--ink);
	}

	figcaption {
		font-size: 11px;
		color: var(--muted);
		margin-top: 10px;
		letter-spacing: 0.05em;
	}
</style>
