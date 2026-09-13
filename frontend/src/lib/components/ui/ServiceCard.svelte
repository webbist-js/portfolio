<script lang="ts">
	import type { Service } from '$lib/strapi';
	import Tag from './Tag.svelte';

	let { service, email }: { service: Service; email?: string } = $props();
</script>

<div class="service-card">
	<div class="head">
		<span class="code mono">{service.code ?? ''}</span>
		{#if service.format}<Tag>{service.format}</Tag>{/if}
	</div>
	<h3>{service.name}</h3>
	{#if service.description}<p class="desc">{service.description}</p>{/if}
	{#if service.bestFor}
		<div class="best-label mono">Best for</div>
		<p class="best">{service.bestFor}</p>
	{/if}
	<dl class="facts mono">
		{#if service.typical}
			<div>
				<dt>typical:</dt>
				<dd>{service.typical}</dd>
			</div>
		{/if}
	</dl>
	{#if email}
		<a href="mailto:{email}?subject={encodeURIComponent(service.name)}" class="link accent discuss"
			>Discuss this <span aria-hidden="true">→</span></a
		>
	{/if}
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

	.best-label {
		margin: 22px 0 8px;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.best {
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
	}

	dd {
		margin: 0;
		color: var(--ink);
	}

	.discuss {
		display: inline-block;
		margin-top: 18px;
		font-size: 14px;
		font-weight: 500;
	}
</style>
