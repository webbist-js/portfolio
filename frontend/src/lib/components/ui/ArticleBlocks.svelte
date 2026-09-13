<script lang="ts">
	import type { ArticleBlock } from '$lib/strapi';
	import { mediaUrl } from '$lib/strapi';
	import CodeBlock from './CodeBlock.svelte';

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
			<h2>
				<span class="mono num" aria-hidden="true">{num} /</span>
				{block.heading}
			</h2>
			<p>{block.body}</p>
		</section>
	{:else if block.__component === 'article.quote'}
		<blockquote class="quote serif">
			<p>{block.text}</p>
			{#if block.attribution}<footer class="mono">— {block.attribution}</footer>{/if}
		</blockquote>
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
		margin-top: 48px;
	}

	.prose-section h2 {
		font-size: 24px;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.prose-section .num {
		font-size: 13px;
		color: var(--accent);
		margin-right: 10px;
	}

	.prose-section p {
		font-size: 16px;
		line-height: 1.7;
		color: var(--ink-2);
		white-space: pre-line;
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
