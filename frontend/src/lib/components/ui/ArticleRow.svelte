<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Article } from '$lib/strapi';
	import Tag from './Tag.svelte';

	let { article, num }: { article: Article; num: string } = $props();

	const external = $derived(Boolean(article.externalUrl));
</script>

<!-- External articles link out to the publisher; internal ones to the slug route. -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a
	href={article.externalUrl ?? resolve('/writing/[slug]', { slug: article.slug })}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener' : undefined}
	class="article-row"
>
	<!-- eslint-enable svelte/no-navigation-without-resolve -->
	<span class="num mono" aria-hidden="true">{num}</span>
	<span class="date mono">{article.date}</span>
	<span class="main">
		<span class="title">{article.title}</span>
		{#if article.excerpt}<span class="excerpt">{article.excerpt}</span>{/if}
		{#if external && article.publisher}
			<span class="publisher mono">{article.publisher}</span>
		{/if}
	</span>
	{#if article.topic}
		<span class="topic"><Tag>{article.topic.name}</Tag></span>
	{:else}
		<span class="topic"></span>
	{/if}
	<span class="read mono">{article.readingTime ?? ''}</span>
	<span class="arrow" aria-hidden="true">{external ? '↗' : '→'}</span>
</a>

<style>
	.article-row {
		display: grid;
		grid-template-columns: 40px 110px 1fr 120px 60px 24px;
		gap: 24px;
		align-items: baseline;
		padding: 32px 24px;
		margin: 0 -24px;
		border-bottom: 1px solid var(--line);
		transition: background 200ms ease;
	}

	.article-row:hover {
		background: var(--panel);
	}

	.num {
		font-size: 11px;
		color: var(--muted);
	}

	.date {
		font-size: 12px;
		color: var(--muted);
	}

	.title {
		display: block;
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.excerpt {
		display: block;
		font-size: 14px;
		color: var(--muted);
		line-height: 1.5;
		margin-top: 8px;
		max-width: 720px;
	}

	.publisher {
		display: block;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-top: 10px;
	}

	.topic {
		display: flex;
		justify-content: center;
	}

	.read {
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

	.article-row:hover .arrow,
	.article-row:focus-visible .arrow {
		transform: translateX(8px);
		color: var(--accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.article-row:hover .arrow,
		.article-row:focus-visible .arrow {
			transform: none;
		}
	}

	@media (max-width: 900px) {
		.article-row {
			grid-template-columns: 40px 1fr 24px;
		}

		.date,
		.topic,
		.read {
			display: none;
		}
	}
</style>
