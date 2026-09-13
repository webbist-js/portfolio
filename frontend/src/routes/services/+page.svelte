<script lang="ts">
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
	title={`Services — ${data.global?.name ?? 'Portfolio'}`}
	description="Four ways to work together: performance rescue, headless build and replatform, interim technical lead, and public-sector delivery."
/>

<PageHero
	kicker="Services · How I help"
	lede="All engagements start with a free 30-minute discovery call. Every engagement is scoped up front — you'll know the shape of the work before we start. Below: what I do, who it's for, and what working together looks like week-by-week."
>
	{#snippet title()}
		{data.services?.length ?? 'Four'} ways to <span class="accent">work together.</span>
	{/snippet}
</PageHero>

{#if data.services?.length}
	<section aria-label="Engagement types">
		<div class="service-grid">
			{#each data.services as s (s.documentId)}
				<ServiceCard service={s} {email} />
			{/each}
		</div>
		<p class="rates-note mono">Rates on request — scoped per engagement.</p>
	</section>
{:else}
	<EmptyState>No services yet — add some in the Strapi admin.</EmptyState>
{/if}

{#if data.phases?.length}
	<section class="section section--rule">
		<SectionHead
			num="P"
			title="How an engagement runs"
			sub="Standard cadence for a full implementation. Scoped work compresses this into two weeks; coaching skips the discovery and architecture phases."
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
			num="Q"
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
			text={data.global.capacityOpenPercent != null && data.global.capacityLabel
				? `${data.global.capacityLabel}: ${data.global.capacityOpenPercent}% open. I take a small number of engagements at a time — get in touch early if you have a date in mind.`
				: undefined}
		>
			{#if email}
				<Button href={`mailto:${email}`} variant="accent"
					>Book discovery call <span aria-hidden="true">→</span></Button
				>
			{/if}
		</CtaBand>
	</div>
{/if}

<style>
	.service-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-top: 1px solid var(--ink);
		border-left: 1px solid var(--ink);
	}

	.rates-note {
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
		color: var(--accent);
		letter-spacing: 0.1em;
		margin-bottom: 8px;
	}

	.phase.dark .phase-meta {
		color: var(--accent-on-dark);
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

	@media (max-width: 900px) {
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
