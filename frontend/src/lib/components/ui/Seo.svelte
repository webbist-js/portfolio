<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_SITE_URL } from '$env/static/public';

	let {
		title,
		description,
		type = 'website',
		image = '/og.png',
		article,
		jsonLd
	}: {
		title: string;
		description: string;
		type?: 'website' | 'article';
		image?: string;
		article?: { publishedTime?: string; author?: string };
		jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	} = $props();

	const canonical = $derived(new URL(page.url.pathname, PUBLIC_SITE_URL).toString());
	const imageUrl = $derived(new URL(image, PUBLIC_SITE_URL).toString());
	// Escape "<" so a closing script tag inside JSON-LD can't break out early;
	// the tag itself is concatenated so the parser never sees a literal script tag.
	const jsonLdTag = $derived(
		jsonLd
			? '<scr' +
					'ipt type="application/ld+json">' +
					JSON.stringify(jsonLd).replaceAll('<', '\\u003c') +
					'</scr' +
					'ipt>'
			: null
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Alex Bennett" />
	<meta property="og:locale" content="en_GB" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{#if article?.publishedTime}
		<meta property="article:published_time" content={article.publishedTime} />
	{/if}
	{#if article?.author}
		<meta property="article:author" content={article.author} />
	{/if}

	{#if jsonLdTag}
		<!-- Safe: jsonLdTag is JSON.stringify output with "<" escaped, wrapped in a fixed tag. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLdTag}
	{/if}
</svelte:head>
