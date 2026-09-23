<script lang="ts">
	import type { Service } from '$lib/strapi';
	import Tag from './Tag.svelte';

	let {
		service,
		email,
		wide = false
	}: {
		service: Service;
		email?: string;
		/** A lone last card in the grid spans both columns; lay it out side by side. */
		wide?: boolean;
	} = $props();

	const quote = $derived(service.testimonial ?? null);
</script>

<div class="service-card" class:wide>
	<div class="main">
		<div class="head">
			<span class="code mono">{service.code ?? ''}</span>
			{#if service.format}<Tag>{service.format}</Tag>{/if}
		</div>
		<h3>{service.name}</h3>
		{#if service.description}<p class="desc">{service.description}</p>{/if}
		{#if service.bestFor}
			<div class="sub-label mono">Best for</div>
			<p class="sub-body">{service.bestFor}</p>
		{/if}
	</div>
	<div class="side">
		{#if service.deliverables}
			<div class="sub-label mono">What you receive</div>
			<p class="sub-body">{service.deliverables}</p>
		{/if}
		{#if service.nextSteps}
			<div class="sub-label mono">What happens next</div>
			<p class="sub-body">{service.nextSteps}</p>
		{/if}
		<dl class="facts mono">
			{#if service.typical}
				<div>
					<dt>typical:</dt>
					<dd>{service.typical}</dd>
				</div>
			{/if}
			{#if service.sectors}
				<div>
					<dt>delivered in:</dt>
					<dd>{service.sectors}</dd>
				</div>
			{/if}
		</dl>
		{#if quote}
			<figure class="quote">
				<blockquote class="serif">{quote.quote}</blockquote>
				<figcaption class="mono">
					{quote.author}{#if quote.role}, {quote.role}{/if}{#if quote.company}
						· {quote.company}{/if}
				</figcaption>
			</figure>
		{/if}
		{#if email}
			<a
				href="mailto:{email}?subject={encodeURIComponent(service.name)}"
				class="link accent discuss">Discuss this <span aria-hidden="true">→</span></a
			>
		{/if}
	</div>
</div>

<style>
	.service-card {
		padding: 40px;
		border-right: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
		min-height: 360px;
		background: var(--white);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.main,
	.side {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
	}

	.service-card.wide {
		grid-column: 1 / -1;
		flex-direction: row;
		align-items: stretch;
		gap: 56px;
	}

	.service-card.wide .main,
	.service-card.wide .side {
		flex: 1 1 0;
		min-width: 0;
	}

	/* Side-by-side, whatever comes first on the right sits level with the head
	   and does not carry a leading rule. */
	.service-card.wide .side > :first-child {
		margin-top: 0;
		padding-top: 0;
		border-top: 0;
	}

	.service-card.wide .side .discuss {
		margin-top: auto;
		padding-top: 18px;
	}

	@media (max-width: 900px) {
		.service-card.wide {
			flex-direction: column;
			gap: 0;
		}
	}

	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		width: 100%;
	}

	.code {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.1em;
	}

	h3 {
		font-size: clamp(24px, 2.5vw, 32px);
		font-weight: 600;
		letter-spacing: -0.025em;
		line-height: 1.1;
		margin: 20px 0 16px;
	}

	.desc {
		font-size: 15px;
		color: var(--ink-3);
		line-height: 1.6;
	}

	.sub-label {
		margin: 22px 0 8px;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.sub-body {
		font-size: 14px;
		color: var(--ink);
		line-height: 1.5;
	}

	.facts {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
		margin: 24px 0 0;
		padding-top: 20px;
		border-top: 1px solid var(--line);
		width: 100%;
		font-size: 12px;
	}

	.facts div {
		display: flex;
		gap: 5px;
	}

	dt {
		color: var(--muted);
		white-space: nowrap;
	}

	dd {
		margin: 0;
		color: var(--ink);
	}

	.quote {
		margin: 24px 0 0;
		padding-left: 16px;
		border-left: 2px solid var(--accent);
	}

	.quote blockquote {
		margin: 0;
		font-size: 16px;
		line-height: 1.5;
		color: var(--ink-2);
	}

	.quote figcaption {
		margin-top: 8px;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.05em;
	}

	.discuss {
		display: inline-block;
		margin-top: 18px;
		font-size: 14px;
		font-weight: 500;
	}
</style>
