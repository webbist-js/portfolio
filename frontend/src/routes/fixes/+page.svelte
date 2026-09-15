<script lang="ts">
	import { resolve } from '$app/paths';
	import { vtMorph } from '$lib/vt.svelte';
	import { Button, CtaBand, EmptyState, Prose, Seo } from '$lib/components';
	import { openBookCall } from '$lib/book-call.svelte';
	import { mediaUrl, type FixPage } from '$lib/strapi';

	let { data } = $props();

	const hub = $derived(data.hub);

	// Accent split for the hero headline, mirroring the homepage highlight.
	const tagline = $derived(hub?.tagline ?? 'Diagnostics for Strapi builds.');
	const highlight = $derived(
		hub?.taglineHighlight && tagline.includes(hub.taglineHighlight) ? hub.taglineHighlight : null
	);

	// Group pages under their category, both levels ordered by `order`.
	const groups = $derived.by(() => {
		const list: {
			slug: string;
			name: string;
			description?: string;
			order: number;
			pages: FixPage[];
		}[] = [];
		for (const page of data.fixPages ?? []) {
			const cat = page.category ?? { name: 'General', slug: 'general', order: 99 };
			let group = list.find((g) => g.slug === cat.slug);
			if (!group) {
				group = {
					slug: cat.slug,
					name: cat.name,
					description: 'description' in cat ? cat.description : undefined,
					order: cat.order,
					pages: []
				};
				list.push(group);
			}
			group.pages.push(page);
		}
		return list
			.sort((a, b) => a.order - b.order)
			.map((g) => ({ ...g, pages: g.pages.toSorted((a, b) => a.order - b.order) }));
	});

	// F/01… codes run in display order across all groups.
	const codes = $derived.by(() => {
		const map: Record<string, string> = {};
		let n = 0;
		for (const g of groups)
			for (const p of g.pages) map[p.documentId] = String(++n).padStart(2, '0');
		return map;
	});

	const pad = (n: number) => String(n + 1).padStart(2, '0');
</script>

<Seo
	title={hub?.seo?.metaTitle ?? `Fixes — ${data.global?.name ?? 'Portfolio'}`}
	description={hub?.seo?.metaDescription ??
		'Practical diagnostics for Strapi 5 problems, written from inside enterprise implementations.'}
	image={mediaUrl(hub?.seo?.metaImage) ?? undefined}
/>

<section class="hero">
	<p class="kicker mono">{hub?.heading ?? 'Fixes'} · Diagnostics</p>
	<h1>
		{#if highlight}
			{tagline.slice(0, tagline.indexOf(highlight))}<span class="hero-hl"
				>{highlight}<svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true">
					<path
						d="M2 8 Q 75 2, 150 7 T 298 6"
						stroke="currentColor"
						stroke-width="2.5"
						fill="none"
						stroke-linecap="round"
					/>
				</svg></span
			>{tagline.slice(tagline.indexOf(highlight) + highlight.length)}
		{:else}
			{tagline}
		{/if}
	</h1>
	<div class="hero-grid">
		{#if hub?.intro}
			<div class="intro">
				<Prose text={hub.intro} />
			</div>
		{/if}
		{#if hub?.steps?.length}
			<aside class="steps grid-bg" aria-label={hub.stepsHeading ?? 'How these pages work'}>
				<div class="steps-head mono">{hub.stepsHeading ?? 'How these pages work'}</div>
				<ol class="steps-list">
					{#each hub.steps as step, i (step.title)}
						<li>
							<span class="step-label mono">{pad(i)} · {step.title}</span>
							<span class="step-body">{step.body}</span>
						</li>
					{/each}
				</ol>
				{#if hub.stepsNote}<p class="steps-note mono">{hub.stepsNote}</p>{/if}
			</aside>
		{/if}
	</div>
</section>

{#if groups.length}
	{#each groups as group, gi (group.slug)}
		<section class="group">
			<div class="group-head">
				<p class="group-num mono">{pad(gi)}</p>
				<h2>{group.name}</h2>
				{#if group.description}<p class="group-desc">{group.description}</p>{/if}
			</div>
			<div class="group-list">
				{#each group.pages as page (page.documentId)}
					<a href={resolve('/fixes/[slug]', { slug: page.slug })} class="fix-row">
						<span class="code mono" aria-hidden="true">F/{codes[page.documentId]}</span>
						<span class="main">
							<span
								class="title"
								style:view-transition-name={vtMorph.slug === page.slug
									? `title-${page.slug}`
									: undefined}
								style:view-transition-class="title">{page.title}</span
							>
							{#if page.hubSummary}<span class="summary">{page.hubSummary}</span>{/if}
							{#if page.symptoms?.length}
								<span class="chips">
									{#each page.symptoms as chip (chip.label)}
										<span class="chip mono">{chip.label}</span>
									{/each}
								</span>
							{/if}
						</span>
						<span class="meta mono">
							<span class="meta-line"
								><span class="dot" aria-hidden="true"></span>live{#if page.readingTime}
									· {page.readingTime}{/if}</span
							>
							{#if page.reviewed}
								<span class="meta-line dim"
									>reviewed {page.reviewed}{#if page.reviewedAgainst}
										· {page.reviewedAgainst}{/if}</span
								>
							{/if}
						</span>
						<span class="arrow" aria-hidden="true">→</span>
					</a>
				{/each}
			</div>
		</section>
	{/each}
{:else}
	<EmptyState>No fixes published yet. Add some in the Strapi admin.</EmptyState>
{/if}

{#if hub?.closingNote}
	<div class="closing">
		<Prose text={hub.closingNote} />
	</div>
{/if}

{#if hub?.service}
	<div class="cta-wrap">
		<CtaBand
			tone="dark"
			kicker={hub.service.code ?? 'Service'}
			title={hub.service.name}
			text={hub.ctaText}
		>
			<Button href={resolve('/services')} variant="accent"
				>See the service <span aria-hidden="true">→</span></Button
			>
			<Button onclick={openBookCall} variant="dark-outline">Book a call</Button>
		</CtaBand>
	</div>
{/if}

<style>
	.hero {
		padding: 80px 0 72px;
	}

	.kicker {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 24px;
	}

	h1 {
		font-size: clamp(44px, 6.5vw, 96px);
		font-weight: 600;
		line-height: 1.02;
		letter-spacing: -0.045em;
		max-width: 1080px;
	}

	.hero-hl {
		position: relative;
		color: var(--accent);
		white-space: nowrap;
	}

	.hero-hl svg {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -0.06em;
		width: 100%;
		height: 0.14em;
		overflow: visible;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(320px, 460px);
		gap: 64px;
		align-items: start;
		margin-top: 56px;
	}

	.intro :global(.prose) {
		font-size: 17px;
		line-height: 1.65;
	}

	.steps {
		background: var(--dark);
		color: var(--dark-text);
		padding: 32px;
	}

	.steps-head {
		font-size: 11px;
		color: var(--accent-on-dark);
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.steps-list {
		list-style: none;
		margin: 8px 0 0;
		padding: 0;
	}

	.steps-list li {
		display: grid;
		grid-template-columns: 110px 1fr;
		gap: 16px;
		align-items: baseline;
		padding: 16px 0;
		border-bottom: 1px solid rgba(250, 250, 247, 0.14);
	}

	.step-label {
		font-size: 11px;
		color: var(--dark-muted);
		white-space: nowrap;
	}

	.step-body {
		font-size: 14px;
		color: var(--dark-soft);
		line-height: 1.5;
	}

	.steps-note {
		font-size: 11px;
		color: var(--dark-muted);
		line-height: 1.6;
		margin: 20px 0 0;
	}

	.group {
		display: grid;
		grid-template-columns: minmax(220px, 320px) minmax(0, 1fr);
		gap: 64px;
		border-top: 1px solid var(--ink);
		padding: 48px 0 64px;
	}

	.group-num {
		font-size: 12px;
		color: var(--accent);
		margin-bottom: 12px;
	}

	.group-head h2 {
		font-size: clamp(30px, 3.4vw, 44px);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.group-desc {
		font-size: 15px;
		color: var(--muted);
		line-height: 1.55;
		margin-top: 14px;
		max-width: 300px;
	}

	.fix-row {
		display: grid;
		grid-template-columns: 56px minmax(0, 1fr) 210px 24px;
		gap: 28px;
		align-items: baseline;
		padding: 36px 0;
	}

	.fix-row + .fix-row {
		border-top: 1px solid var(--line);
	}

	.code {
		font-size: 12px;
		color: var(--muted);
	}

	.title {
		display: block;
		font-size: clamp(22px, 2.4vw, 30px);
		font-weight: 600;
		letter-spacing: -0.025em;
		line-height: 1.15;
		transition: color 200ms;
	}

	.fix-row:hover .title {
		color: var(--accent-solid, var(--accent));
	}

	.summary {
		display: block;
		font-size: 15px;
		color: var(--ink-2);
		line-height: 1.55;
		margin-top: 12px;
		max-width: 620px;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 16px;
	}

	.chip {
		font-size: 11px;
		color: var(--ink-2);
		border: 1px solid var(--line);
		padding: 4px 9px;
		white-space: nowrap;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 11px;
	}

	.meta-line {
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		display: inline-block;
	}

	.dim {
		color: var(--muted);
	}

	.arrow {
		font-size: 18px;
		color: var(--muted);
		transition:
			transform 280ms var(--ease-out),
			color 200ms;
	}

	.fix-row:hover .arrow,
	.fix-row:focus-visible .arrow {
		transform: translateX(8px);
		color: var(--accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.fix-row:hover .arrow,
		.fix-row:focus-visible .arrow {
			transform: none;
		}
	}

	.closing {
		max-width: 760px;
		padding: 8px 0 0;
	}

	.cta-wrap {
		margin-top: 48px;
	}

	@media (max-width: 900px) {
		.hero-hl svg {
			display: none;
		}

		.hero-grid {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.group {
			grid-template-columns: 1fr;
			gap: 28px;
			padding: 40px 0 48px;
		}

		.fix-row {
			grid-template-columns: minmax(0, 1fr) 24px;
			gap: 12px;
		}

		.code,
		.meta {
			display: none;
		}
	}
</style>
