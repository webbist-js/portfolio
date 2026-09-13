<script lang="ts">
	import { resolve } from '$app/paths';
	import portrait from '$lib/assets/portrait.jpg';
	import {
		ActivityFeed,
		Button,
		CtaBand,
		EmptyState,
		FeaturedCaseCard,
		MonoLabel,
		PillarGrid,
		ProjectRow,
		SectionHead,
		Seo,
		ServiceTable,
		StackMarquee,
		StatFlipCard,
		Tag,
		TestimonialWall
	} from '$lib/components';

	import { personJsonLd, websiteJsonLd } from '$lib/seo';

	let { data } = $props();
	const hp = $derived(data.homepage);
	const email = $derived(data.global?.email);

	const featured = $derived(hp?.featuredProject ?? null);
	const otherProjects = $derived(
		(data.projects ?? []).filter((p) => p.slug !== featured?.slug).slice(0, 5)
	);

	// Writing spotlight: the featured article, falling back to the latest.
	const spotlight = $derived.by(() => {
		const articles = data.articles ?? [];
		return articles.find((a) => a.featured) ?? articles[0] ?? null;
	});

	// Testimonials: lead with the featured quote, then up to two supporting ones.
</script>

<Seo
	title={`${data.global?.name ?? 'Portfolio'} — ${data.global?.jobTitle ?? 'technical lead'}`}
	description={hp?.lede ?? 'Portfolio of a technical lead in the JS ecosystem.'}
	jsonLd={[personJsonLd(data.global), websiteJsonLd(data.global)]}
/>

{#if hp}
	<!-- Hero -->
	<section class="hero-section">
		<aside class="hero-aside">
			<figure class="portrait">
				<img src={portrait} alt="Alex Bennett" width="800" height="800" />
				<figcaption class="mono portrait-caption">
					{data.global?.name ?? 'Alex Bennett'} · {data.global?.location ?? 'UK · Remote'}
				</figcaption>
			</figure>
			{#if data.activities?.length}
				<div class="feed-wrap">
					<ActivityFeed activities={data.activities} limit={3} />
				</div>
			{/if}
		</aside>

		<div>
			<div class="hero-tags">
				{#if data.global?.available && data.global?.availabilityNote}
					<Tag variant="accent"
						><span aria-hidden="true">●</span> {data.global.availabilityNote}</Tag
					>
				{/if}
				{#if data.global?.jobTitle}<Tag>{data.global.jobTitle}</Tag>{/if}
				{#each (data.global?.stack ?? []).slice(0, 2) as t (t.label)}
					<Tag>{t.label}</Tag>
				{/each}
			</div>

			{#if hp.heroHeadline}
				{@const accent = hp.heroAccent ?? ''}
				{@const hl =
					hp.heroHighlight && accent.includes(hp.heroHighlight) ? hp.heroHighlight : null}
				<h1 class="hero">
					<span class="hero-line">{hp.heroHeadline}</span>
					{#if accent}
						<span class="hero-line" class:accent={!hl}>
							{#if hl}
								{accent.slice(0, accent.indexOf(hl))}<span class="hero-hl"
									>{hl}<svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true">
										<path
											d="M2 8 Q 75 2, 150 7 T 298 6"
											stroke="currentColor"
											stroke-width="2.5"
											fill="none"
											stroke-linecap="round"
										/>
									</svg></span
								>{accent.slice(accent.indexOf(hl) + hl.length)}
							{:else}
								{accent}
							{/if}
						</span>{#if hp.footnote}<sup class="serif fn-mark" aria-hidden="true">1</sup>{/if}
					{/if}
				</h1>
			{/if}

			<div class="hero-body">
				<div>
					{#if hp.lede}<p class="lede">{hp.lede}</p>{/if}
					{#if hp.footnote}
						<p class="footnote hero-footnote">
							<sup aria-hidden="true">1</sup>&nbsp; {hp.footnote}
						</p>
					{/if}
					<div class="hero-actions">
						{#if email}
							<Button href={`mailto:${email}`}
								>Book a 30-min call <span aria-hidden="true">→</span></Button
							>
						{/if}
						<Button
							href="https://strapi.io/blog/building-high-performance-strapi-applications-common-pitfalls-and-best-practices"
							variant="ghost">Read: why your Strapi is slow <span aria-hidden="true">↗</span></Button
						>
					</div>
				</div>

				{#if hp.thisWeek.length}
					<div>
						<MonoLabel class="this-week-label">This week</MonoLabel>
						<ul class="this-week">
							{#each hp.thisWeek as item (item.text)}
								<li>
									<span class="week-dot" class:highlight={item.highlight} aria-hidden="true"></span>
									<span>{item.text}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Stats flip cards -->
	{#if hp.stats.length}
		<section class="stats-strip" aria-label="Track record">
			{#each hp.stats as stat, i (stat.label)}
				<StatFlipCard {stat} index={i} />
			{/each}
		</section>
	{/if}

	<!-- What I do: services rate card -->
	{#if data.services?.length}
		<section class="section">
			<SectionHead
				num="01"
				title="What I do"
				sub="Ways I plug in as an independent, hands-on technical lead. Scoped per engagement."
				action={{ label: 'Full services', href: resolve('/services') }}
			/>
			<ServiceTable services={data.services} />
		</section>
	{/if}

	<!-- How I work: pillars -->
	{#if hp.howIWork.length}
		<section class="section">
			<SectionHead
				num="02"
				title="How I work"
				sub="The operating principles behind every engagement."
			/>
			<PillarGrid pillars={hp.howIWork} />
		</section>
	{/if}

	<!-- Selected work -->
	{#if featured || otherProjects.length}
		<section class="section">
			<SectionHead
				num="03"
				title="Selected work"
				sub="Open-source plugins, headless re-platforms, DAM and public-sector rollouts."
				action={{ label: 'All projects', href: resolve('/work') }}
			/>
			{#if featured}
				<div class="featured-wrap">
					<FeaturedCaseCard project={featured} />
				</div>
			{/if}
			{#if otherProjects.length}
				<div class="row-list">
					{#each otherProjects as p, i (p.documentId)}
						<ProjectRow project={p} num={String(i + 2).padStart(2, '0')} />
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	<!-- Stack marquee -->
	{#if data.global?.stack?.length}
		<div class="marquee-band">
			<StackMarquee items={data.global.stack} />
		</div>
	{/if}

	<!-- Writing spotlight -->
	{#if spotlight}
		<section class="section writing-spotlight">
			<MonoLabel>04 · Writing</MonoLabel>
			<h2 class="spot-title">{spotlight.title}</h2>
			{#if spotlight.excerpt}<p class="spot-excerpt">{spotlight.excerpt}</p>{/if}
			<div class="spot-foot">
				{#if spotlight.externalUrl}
					<!-- External piece: publisher hosts it. -->
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a
						class="link accent spot-link"
						href={spotlight.externalUrl}
						target="_blank"
						rel="noopener">Read piece <span aria-hidden="true">↗</span></a
					>
					{#if spotlight.publisher}
						<span class="spot-publisher mono">Published on {spotlight.publisher}</span>
					{/if}
				{:else}
					<a
						class="link accent spot-link"
						href={resolve('/writing/[slug]', { slug: spotlight.slug })}
						>Read piece <span aria-hidden="true">→</span></a
					>
				{/if}
			</div>
		</section>
	{/if}

	<!-- What people say -->
	{#if data.testimonials?.length}
		<section class="section testimonial-section">
			<SectionHead num="05" title="What people say" />
			<TestimonialWall testimonials={data.testimonials} />
		</section>
	{/if}

	<!-- CTA -->
	<div class="cta-band">
		<CtaBand
			tone="dark"
			big
			kicker="06 · Get in touch"
			title="Planning a Strapi rollout?"
			titleAccent="Let's talk."
			text="I take a small number of engagements each year, deliberately. Best fit: teams with their own frontend engineers — whatever the framework — bringing Strapi in to replace a legacy CMS or stand up a new headless platform. Discovery calls are always free."
		>
			{#if email}
				<Button href={`mailto:${email}`} variant="accent"
					>Book a call <span aria-hidden="true">→</span></Button
				>
				<Button href={`mailto:${email}`} variant="dark-outline">{email}</Button>
			{/if}
		</CtaBand>
	</div>
{:else}
	<EmptyState>
		No homepage content yet.<br />
		Start Strapi (<code>npm run develop</code> in <code>backend/</code>), then fill in the Homepage
		and Global single types in the admin panel.
	</EmptyState>
{/if}

<style>
	.hero-section {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 48px;
		align-items: start;
		padding: 80px 0;
	}

	.hero-aside {
		position: sticky;
		top: 100px;
	}

	.portrait {
		margin: 0;
	}

	.portrait img {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--ink);
	}

	.portrait-caption {
		margin-top: 10px;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.feed-wrap {
		margin-top: 20px;
	}

	.hero-tags {
		display: flex;
		gap: 8px;
		margin-bottom: 36px;
		flex-wrap: wrap;
	}

	.hero {
		font-size: clamp(48px, 6.5vw, 84px);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.045em;
		max-width: 900px;
	}

	.hero-line {
		display: block;
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

	.fn-mark {
		font-size: 0.35em;
		color: var(--accent);
		font-weight: 400;
	}

	.hero-body {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 56px;
		margin-top: 56px;
		align-items: start;
	}

	.hero-footnote {
		margin-top: 24px;
	}

	.hero-actions {
		display: flex;
		gap: 12px;
		margin-top: 36px;
		flex-wrap: wrap;
	}

	:global(.this-week-label) {
		margin-bottom: 14px;
	}

	.this-week {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.this-week li {
		display: flex;
		gap: 10px;
		align-items: baseline;
		font-size: 14px;
		line-height: 1.5;
	}

	.week-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink);
		flex-shrink: 0;
		position: relative;
		top: -2px;
	}

	.week-dot.highlight {
		background: var(--accent);
	}

	.stats-strip {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		border-top: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
	}

	.featured-wrap {
		margin-bottom: 48px;
	}

	.row-list {
		border-top: 1px solid var(--ink);
	}

	.marquee-band {
		/* Full-bleed: escape both the shell padding and its max-width. */
		width: 100vw;
		margin-inline: calc(50% - 50vw);
	}

	.writing-spotlight {
		border-bottom: 1px solid var(--line);
	}

	.spot-title {
		font-size: clamp(28px, 3.5vw, 44px);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.1;
		margin-top: 20px;
		max-width: 800px;
	}

	.spot-excerpt {
		font-size: 16px;
		color: var(--ink-2);
		line-height: 1.6;
		margin-top: 18px;
		max-width: 680px;
	}

	.spot-foot {
		display: flex;
		gap: 16px;
		align-items: baseline;
		margin-top: 24px;
		flex-wrap: wrap;
	}

	.spot-link {
		font-size: 14px;
		font-weight: 500;
	}

	.spot-publisher {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.testimonial-section {
		border-bottom: 1px solid var(--line);
	}

	.cta-band {
		margin: 72px -64px 0;
	}

	@media (max-width: 1100px) {
		.hero-section {
			grid-template-columns: 1fr;
		}

		.hero-aside {
			position: static;
			order: 2;
			max-width: 420px;
		}
	}

	@media (max-width: 900px) {
		.hero-body {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.stats-strip {
			grid-template-columns: 1fr 1fr;
		}

		.cta-band {
			margin-left: -24px;
			margin-right: -24px;
		}
	}
</style>
