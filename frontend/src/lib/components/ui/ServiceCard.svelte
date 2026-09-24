<script lang="ts">
	import type { Service } from '$lib/strapi';
	import { barGeometry, keyword, lines, parseDuration } from '$lib/duration';
	import Tag from './Tag.svelte';

	let { service, email }: { service: Service; email?: string } = $props();

	const bullets = $derived(lines(service.deliverables));
	const range = $derived(parseDuration(service.typical));
	const bar = $derived(range ? barGeometry(range) : null);
	const word = $derived(keyword(service.name));
</script>

<div class="service-card">
	<div class="head">
		<span class="code mono">{service.code ?? ''}</span>
		{#if service.format}<Tag>{service.format}</Tag>{/if}
	</div>
	<h3>{service.name}</h3>
	{#if service.description}<p class="desc">{service.description}</p>{/if}

	{#if service.bestFor}
		<div class="best">
			<span class="best-label mono">Best for</span>
			<p>{service.bestFor}</p>
		</div>
	{/if}

	{#if bullets.length}
		<ul class="bullets">
			{#each bullets as b (b)}
				<li><span class="plus mono" aria-hidden="true">+</span>{b}</li>
			{/each}
		</ul>
	{/if}
	{#if service.nextSteps}<p class="next">{service.nextSteps}</p>{/if}

	{#if service.typical}
		<div class="typical mono">
			<span class="typical-key">typical:</span>
			<span>{service.typical}</span>
		</div>
		{#if bar}
			<div
				class="bar"
				role="img"
				aria-label="{service.typical} on a shared axis of zero to six months"
			>
				<span class="fill" style:left="{bar.left}%" style:width="{bar.width}%"></span>
			</div>
			<div class="ticks mono" aria-hidden="true">
				<span class="tick t0">0</span>
				<span class="tick t1">1 mo</span>
				<span class="tick t3">3 mo</span>
				<span class="tick t6">6 mo</span>
			</div>
		{/if}
	{/if}

	{#if email}
		<a href="mailto:{email}?subject={encodeURIComponent(service.name)}" class="discuss">
			<span>Discuss</span>
			<span class="word">{word}</span>
			<span aria-hidden="true">→</span>
		</a>
	{/if}
</div>

<style>
	.service-card {
		padding: 40px;
		border-right: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
		background: var(--white);
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	/* Accent, not muted: a deliberate exception to the kicker rule, per the
	   design. It is a reference code, not a heading kicker. */
	.code {
		font-size: 12px;
		color: var(--accent);
		letter-spacing: 0.1em;
	}

	h3 {
		font-size: clamp(26px, 2.4vw, 34px);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.05;
		margin: 36px 0 20px;
		text-wrap: balance;
	}

	.desc {
		font-size: 16px;
		color: var(--ink-3);
		line-height: 1.6;
		margin-bottom: 36px;
	}

	.best {
		background: var(--panel);
		border-left: 3px solid var(--ink);
		padding: 20px 22px;
	}

	.best-label {
		display: block;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 8px;
	}

	.best p {
		font-size: 15px;
		line-height: 1.5;
		color: var(--ink);
	}

	.bullets {
		list-style: none;
		margin: 24px 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.bullets li {
		display: flex;
		gap: 16px;
		align-items: baseline;
		font-size: 15px;
		line-height: 1.45;
	}

	.plus {
		color: var(--accent);
		font-size: 13px;
	}

	.next {
		margin-top: 20px;
		font-size: 13px;
		line-height: 1.5;
		color: var(--muted);
	}

	/* Pinned to the bottom so bars and buttons line up across the row
	   whatever the copy above them runs to. */
	.typical {
		margin-top: auto;
		padding-top: 32px;
		font-size: 13px;
		display: flex;
		gap: 6px;
	}

	.typical-key {
		color: var(--muted);
	}

	.bar {
		position: relative;
		height: 8px;
		background: var(--line);
		margin-top: 14px;
	}

	.fill {
		position: absolute;
		top: 0;
		bottom: 0;
		background: var(--ink);
	}

	/* Labels sit at their true positions on the 0–6 month axis. */
	.ticks {
		position: relative;
		height: 14px;
		font-size: 10px;
		color: var(--muted);
		letter-spacing: 0.06em;
		margin-top: 8px;
	}

	.tick {
		position: absolute;
		top: 0;
		transform: translateX(-50%);
		white-space: nowrap;
	}

	.t0 {
		left: 0;
		transform: none;
	}

	.t1 {
		left: 16.667%;
	}

	.t3 {
		left: 50%;
	}

	.t6 {
		left: 100%;
		transform: translateX(-100%);
	}

	.discuss {
		margin-top: 32px;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 18px 22px;
		border: 1px solid var(--ink);
		font-size: 16px;
		font-weight: 500;
		color: var(--ink);
		transition:
			background 200ms,
			color 200ms;
	}

	.discuss .word {
		text-align: center;
	}

	.discuss span:last-child {
		text-align: right;
	}

	.discuss:hover,
	.discuss:focus-visible {
		background: var(--ink);
		color: var(--dark-text);
	}

	@media (max-width: 900px) {
		.service-card {
			padding: 28px 24px;
		}

		h3 {
			margin-top: 24px;
		}

		.desc {
			margin-bottom: 24px;
		}
	}
</style>
