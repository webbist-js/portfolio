<script lang="ts">
	import { openBookCall } from '$lib/book-call.svelte';
	import {
		Button,
		CtaBand,
		EmptyState,
		FaqAccordion,
		PageHero,
		SectionHead,
		Seo,
		ServiceCard
	} from '$lib/components';

	let { data } = $props();
	const email = $derived(data.global?.email);
</script>

<Seo
	title={`Strapi consulting: rescue, builds, interim lead — ${data.global?.name ?? 'Portfolio'}`}
	description="Part-time, fixed-scope Strapi engagements: architecture review, performance rescue, build and migrate, fractional technical lead. Public sector and GLAM experience."
/>

<PageHero
	kicker="Services · How I help"
	lede="Independent work runs part-time, outside my core hours at Strapi, and is fixed-scope or advisory rather than embedded full-time. Every engagement is scoped up front so you know what you receive and where it ends. Public sector, GLAM and enterprise are where most of it has been delivered. It all starts with a free 30-minute call."
>
	{#snippet title()}
		{data.services?.length ?? 'Four'} ways to <span class="accent">work together.</span>
	{/snippet}
</PageHero>

{#if data.services?.length}
	{@const count = data.services.length}
	<section aria-label="Engagement types">
		<!-- Three across for three; four falls back to two by two rather than
		     squeezing four columns. -->
		<div class="service-grid" style:--cols={count === 4 ? 2 : Math.min(count, 3)}>
			{#each data.services as s (s.documentId)}
				<ServiceCard service={s} {email} />
			{/each}
		</div>
		<div class="grid-foot mono">
			<span>Rates on request · scoped per engagement.</span>
			<span>Bars share one axis · 0 → 6 months</span>
		</div>
	</section>
{:else}
	<EmptyState>No services yet. Add some in the Strapi admin.</EmptyState>
{/if}

{#if data.phases?.length}
	<section class="section section--rule">
		<SectionHead
			title="How an engagement runs"
			sub="The shape of a build or migration, part-time. A review or rescue compresses this into one to three weeks; a fractional lead role skips discovery and architecture."
		/>
		<ol class="process">
			{#each data.phases as ph, i (ph.documentId)}
				<li class="phase" class:dark={i === 0}>
					<div class="phase-meta mono">
						{ph.step ?? String(i + 1).padStart(2, '0')}{#if ph.week}
							· {ph.week}{/if}
					</div>
					<h3>{ph.title}</h3>
					{#if ph.description}<p>{ph.description}</p>{/if}
				</li>
			{/each}
		</ol>
	</section>
{/if}

{#if data.faqs?.length}
	<section class="section">
		<SectionHead
			title="Common questions"
			sub="The things prospective clients always ask before booking the discovery call."
		/>
		<FaqAccordion faqs={data.faqs} />
	</section>
{/if}

{#if data.global?.available}
	<div class="avail-band">
		<CtaBand
			tone="dark"
			kicker="Availability"
			title="Currently"
			titleAccent={data.global.availabilityNote ?? 'taking bookings'}
			text="One or two engagements at a time, part-time. Get in touch early if you have a date in mind."
		>
			<Button onclick={openBookCall} variant="accent"
				>Request a discovery call <span aria-hidden="true">→</span></Button
			>
		</CtaBand>
	</div>
{/if}

<style>
	.service-grid {
		display: grid;
		grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr));
		border-top: 1px solid var(--ink);
		border-left: 1px solid var(--ink);
	}

	.grid-foot {
		display: flex;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin: 20px 0 60px;
	}

	.process {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		border-top: 1px solid var(--ink);
		border-left: 1px solid var(--ink);
	}

	.phase {
		padding: 28px;
		border-right: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
		min-height: 240px;
		background: var(--white);
	}

	.phase.dark {
		background: var(--dark);
		color: var(--dark-text);
	}

	.phase-meta {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.1em;
		margin-bottom: 8px;
	}

	.phase.dark .phase-meta {
		color: var(--dark-muted);
	}

	.phase h3 {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.15;
		margin-bottom: 14px;
	}

	.phase p {
		font-size: 13px;
		line-height: 1.55;
		color: var(--ink-3);
	}

	.phase.dark p {
		color: var(--dark-soft);
	}

	.avail-band {
		margin-top: 40px;
	}

	@media (max-width: 1100px) {
		.process {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 1100px) {
		.service-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 700px) {
		.service-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.process {
			grid-template-columns: 1fr;
		}
	}
</style>
