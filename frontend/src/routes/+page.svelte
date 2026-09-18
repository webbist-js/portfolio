<script lang="ts">
	import { resolve } from '$app/paths';
	import { linkedinRecommendationsUrl, mediaUrl } from '$lib/strapi';
	import portrait from '$lib/assets/portrait.jpg';
	import { openBookCall } from '$lib/book-call.svelte';
	import {
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
		StatFlipCard,
		Tag,
		TestimonialWall,
		ThisWeek
	} from '$lib/components';

	import { personJsonLd, websiteJsonLd } from '$lib/seo';

	let { data } = $props();
	const hp = $derived(data.homepage);
	const email = $derived(data.global?.email);
	const recommendationsUrl = $derived(linkedinRecommendationsUrl(data.global));

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
	title={hp?.seo?.metaTitle ??
		`Enterprise Strapi & headless CMS technical lead — ${data.global?.name ?? 'Alex Bennett'}`}
	description={hp?.seo?.metaDescription ??
		'Hands-on technical lead for enterprise Strapi and headless platforms. Performance rescues, replatforms and interim leadership. UK-based, fully remote.'}
	image={mediaUrl(hp?.seo?.metaImage) ?? undefined}
	jsonLd={[personJsonLd(data.global), websiteJsonLd(data.global)]}
/>

{#if hp}
	<!-- Hero -->
	<section class="hero-section">
		<div class="hero-top">
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
			<div class="hero-id">
				<span class="hero-id-text">
					<span class="hero-id-name">{data.global?.name ?? 'Alex Bennett'}</span>
					<span class="mono hero-id-loc">{data.global?.location ?? 'UK · Remote'}</span>
				</span>
				<img class="hero-avatar" src={portrait} alt="" width="800" height="800" />
			</div>
		</div>

		<div>
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
						<Button onclick={openBookCall}
							>Book a 30-min call <span aria-hidden="true">→</span></Button
						>
						<Button
							href="https://strapi.io/blog/building-high-performance-strapi-applications-common-pitfalls-and-best-practices"
							variant="ghost"
							>Read: why your Strapi is slow <span aria-hidden="true">↗</span></Button
						>
					</div>
				</div>

				{#if data.thisWeek?.length}
					<ThisWeek items={data.thisWeek} />
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
				sub="Case studies, abridged where confidentiality requires."
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
			<SectionHead
				num="05"
				title="What people say"
				sub="Colleagues, clients, and the person whose role I covered. Marked quotes are public recommendations you can read in full on LinkedIn."
			/>
			<TestimonialWall testimonials={data.testimonials} {recommendationsUrl} />
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
			text="I take a small number of engagements each year, deliberately. Best fit: teams with their own frontend engineers (whatever the framework) bringing Strapi in to replace a legacy CMS or stand up a new headless platform. Discovery calls are always free."
		>
			<Button onclick={openBookCall} variant="accent"
				>Book a call <span aria-hidden="true">→</span></Button
			>
			{#if email}
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
		padding: 80px 0;
	}

	.hero-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 24px;
		margin-bottom: 36px;
	}

	.hero-tags {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.hero-id {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-shrink: 0;
	}

	.hero-id-text {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 4px;
	}

	.hero-id-name {
		font-weight: 600;
		font-size: 15px;
		letter-spacing: -0.01em;
	}

	.hero-id-loc {
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.hero-avatar {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		object-fit: cover;
		box-shadow: -3px 3px 0 var(--accent);
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
		.hero-top {
			flex-direction: column-reverse;
			align-items: flex-start;
		}

		.hero-id-text {
			align-items: flex-start;
			order: 2;
		}
	}

	@media (max-width: 900px) {
		.hero-body {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.hero {
			font-size: clamp(40px, 10.5vw, 64px);
		}

		/* The underline flourish's bounding box overflows once the
		   highlight wraps — it's decorative, so drop it on small screens. */
		.hero-hl svg {
			display: none;
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
