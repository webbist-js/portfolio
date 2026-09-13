<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArticleBlocks, MonoLabel, Seo, Tag } from '$lib/components';

	let { data } = $props();
	const a = $derived(data.article);
</script>

<Seo
	title={`${a.title} — ${data.global?.name ?? 'Portfolio'}`}
	description={a.excerpt ?? a.intro ?? a.title}
	type="article"
	article={{ publishedTime: a.date, author: data.global?.name }}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: a.title,
		description: a.excerpt ?? undefined,
		datePublished: a.date,
		dateModified: a.updatedAt?.slice(0, 10) ?? a.date,
		author: { '@type': 'Person', name: data.global?.name ?? 'Alex Bennett' }
	}}
/>

<article class="article">
	<header class="article-head">
		<a href={resolve('/writing')} class="link crumb mono"
			><span aria-hidden="true">←</span> All writing</a
		>
		<div class="meta mono">
			<span>{a.date}</span>
			{#if a.readingTime}<span aria-hidden="true">·</span><span>{a.readingTime} read</span>{/if}
			{#if a.topic}<span aria-hidden="true">·</span><Tag variant="accent">{a.topic.name}</Tag>{/if}
		</div>
		<h1 style:view-transition-name={`title-${a.slug}`}>{a.title}</h1>
		{#if a.intro}
			<p class="standfirst serif">{a.intro}</p>
		{/if}
	</header>

	<div class="article-body">
		<ArticleBlocks blocks={a.blocks ?? []} />
	</div>

	<footer class="article-foot">
		<div class="author">
			<div class="avatar" aria-hidden="true">
				{(data.global?.name ?? 'A B')
					.split(' ')
					.map((w) => w[0])
					.join('')}
			</div>
			<div>
				<div class="author-name">{data.global?.name ?? 'Author'}</div>
				{#if data.global?.jobTitle}
					<div class="author-role mono">{data.global.jobTitle}</div>
				{/if}
			</div>
		</div>
		{#if data.global?.socialLinks?.length}
			<div class="share">
				{#each data.global.socialLinks as link (link.label)}
					<a href={link.url} class="share-link mono"
						>{link.label} <span aria-hidden="true">↗</span></a
					>
				{/each}
			</div>
		{/if}
	</footer>

	{#if data.next}
		<a href={resolve('/writing/[slug]', { slug: data.next.slug })} class="next-piece">
			<MonoLabel tone="accent" class="next-label">Next piece →</MonoLabel>
			<span class="next-title">{data.next.title}</span>
			<span class="next-meta mono"
				>{data.next.date}{#if data.next.readingTime}
					· {data.next.readingTime}{/if}</span
			>
		</a>
	{/if}
</article>

<style>
	.article {
		max-width: 760px;
		margin: 0 auto;
	}

	.article-head {
		padding: 60px 0 56px;
	}

	.crumb {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.meta {
		display: flex;
		gap: 12px;
		align-items: center;
		margin-top: 28px;
		font-size: 12px;
		color: var(--muted);
		flex-wrap: wrap;
	}

	h1 {
		font-size: clamp(36px, 5vw, 64px);
		font-weight: 600;
		letter-spacing: -0.04em;
		line-height: 1.05;
		margin-top: 24px;
	}

	.standfirst {
		font-size: 22px;
		color: var(--ink-2);
		line-height: 1.5;
		margin-top: 40px;
		border-left: 2px solid var(--accent);
		padding-left: 24px;
	}

	.article-body {
		padding-bottom: 60px;
	}

	.article-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 32px;
		padding: 40px 0;
		border-top: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
		flex-wrap: wrap;
	}

	.author {
		display: flex;
		gap: 16px;
		align-items: center;
	}

	.avatar {
		width: 56px;
		height: 56px;
		background: var(--dark);
		color: var(--accent-on-dark);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.author-name {
		font-size: 16px;
		font-weight: 600;
	}

	.author-role {
		font-size: 11px;
		color: var(--muted);
		margin-top: 2px;
		text-transform: capitalize;
	}

	.share {
		display: flex;
		gap: 8px;
	}

	.share-link {
		padding: 4px 10px;
		border: 1px solid var(--line);
		background: var(--white);
		font-size: 11px;
		color: var(--ink-3);
		transition:
			border-color 200ms,
			color 200ms;
	}

	.share-link:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.next-piece {
		display: block;
		padding: 28px 0 40px;
		border-bottom: 1px solid var(--line);
	}

	:global(.next-label) {
		margin-bottom: 12px;
	}

	.next-title {
		display: block;
		font-size: 28px;
		font-weight: 600;
		letter-spacing: -0.025em;
		line-height: 1.15;
		transition: color 200ms;
	}

	.next-piece:hover .next-title {
		color: var(--accent);
	}

	.next-meta {
		display: block;
		font-size: 11px;
		color: var(--muted);
		margin-top: 8px;
	}
</style>
