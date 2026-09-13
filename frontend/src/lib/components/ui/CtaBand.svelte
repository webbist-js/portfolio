<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tone = 'dark',
		kicker,
		title,
		titleAccent,
		text,
		big = false,
		children
	}: {
		tone?: 'dark' | 'panel' | 'outline';
		kicker: string;
		title: string;
		titleAccent?: string;
		text?: string;
		big?: boolean;
		children?: Snippet;
	} = $props();
</script>

<section class="cta {tone}" class:big>
	{#if tone === 'dark'}<div class="grid-bg bg" aria-hidden="true"></div>{/if}
	<div class="inner">
		<div>
			<p class="kicker mono"><span aria-hidden="true">§</span> {kicker}</p>
			<h2>
				{titleAccent ? `${title} ` : title}{#if titleAccent}<span class="ta">{titleAccent}</span
					>{/if}
			</h2>
			{#if text}<p class="text">{text}</p>{/if}
		</div>
		{#if children}
			<div class="actions">{@render children()}</div>
		{/if}
	</div>
</section>

<style>
	.cta {
		position: relative;
		overflow: hidden;
		padding: 60px 48px;
	}

	.cta.big {
		padding: 100px 48px;
	}

	.cta.dark {
		background: var(--dark);
		color: var(--dark-text);
	}

	.cta.panel {
		background: var(--panel);
		border: 1px solid var(--ink);
	}

	.cta.outline {
		border: 1px solid var(--ink);
	}

	.bg {
		position: absolute;
		inset: 0;
		opacity: 0.4;
	}

	.inner {
		position: relative;
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		gap: 56px;
		align-items: end;
	}

	.kicker {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 20px;
		color: var(--accent);
	}

	.dark .kicker {
		color: var(--accent-on-dark);
	}

	h2 {
		font-weight: 600;
		letter-spacing: -0.035em;
		line-height: 1.02;
		font-size: clamp(30px, 3.5vw, 44px);
	}

	.big h2 {
		font-size: clamp(40px, 6vw, 80px);
		letter-spacing: -0.04em;
		line-height: 0.98;
	}

	.ta {
		color: var(--accent);
	}

	.dark .ta {
		color: var(--accent-on-dark);
	}

	.text {
		font-size: 16px;
		line-height: 1.6;
		margin-top: 16px;
		max-width: 560px;
		color: var(--ink-3);
	}

	.dark .text {
		color: var(--dark-soft);
	}

	.actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	@media (max-width: 900px) {
		.cta,
		.cta.big {
			padding: 48px 28px;
		}

		.inner {
			grid-template-columns: 1fr;
			align-items: start;
		}

		.actions {
			justify-content: flex-start;
		}
	}
</style>
