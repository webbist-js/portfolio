<script lang="ts">
	import type { Stat } from '$lib/strapi';

	let { stat, index }: { stat: Stat; index: number } = $props();

	const num = $derived(String(index + 1).padStart(2, '0'));
</script>

<!--
	Flip card: front face shows the stat, back face (accent) shows context.
	The back is revealed on hover and keyboard focus; because it is hidden
	with transform/opacity (not display:none) it stays in the accessibility
	tree, so screen readers announce the context text too.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="stat-card" tabindex={stat.context ? 0 : undefined}>
	<div class="face">
		<span class="corner mono" aria-hidden="true">{num} ↗</span>
		<div class="value">{stat.value}</div>
		<div class="label">{stat.label}</div>
		{#if stat.sublabel}<div class="sub">{stat.sublabel}</div>{/if}
		{#if stat.context}<span class="hint serif" aria-hidden="true">hover ↻</span>{/if}
	</div>
	{#if stat.context}
		<div class="back">
			<span class="back-label mono" aria-hidden="true">{num} / context</span>
			<p class="serif">{stat.context}</p>
		</div>
	{/if}
</div>

<style>
	.stat-card {
		position: relative;
		overflow: hidden;
		min-height: 220px;
		border-right: 1px solid var(--line);
	}

	.stat-card:last-child {
		border-right: none;
	}

	.face {
		position: relative;
		height: 100%;
		min-height: 220px;
		padding: 40px 28px;
		transition:
			transform 500ms var(--ease-out),
			opacity 300ms;
	}

	.corner {
		position: absolute;
		top: 14px;
		left: 18px;
		font-size: 10px;
		color: var(--muted);
		letter-spacing: 0.12em;
	}

	.value {
		font-size: clamp(48px, 6vw, 84px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 0.9;
		margin-top: 16px;
	}

	.label {
		font-size: 14px;
		font-weight: 500;
		color: var(--accent);
		margin-top: 12px;
	}

	.sub {
		font-size: 13px;
		color: var(--muted);
		margin-top: 4px;
	}

	.hint {
		position: absolute;
		bottom: 14px;
		right: 18px;
		font-size: 11px;
		color: var(--muted);
	}

	.back {
		position: absolute;
		inset: 0;
		padding: 40px 28px;
		background: var(--accent-solid);
		color: var(--dark-text);
		transform: translateY(100%);
		opacity: 0;
		transition:
			transform 500ms var(--ease-out),
			opacity 300ms;
	}

	.back-label {
		display: block;
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 14px;
		opacity: 0.85;
	}

	.back p {
		font-size: 17px;
		line-height: 1.45;
	}

	.stat-card:hover .face,
	.stat-card:focus-visible .face {
		transform: translateY(-100%);
		opacity: 0;
	}

	.stat-card:hover .back,
	.stat-card:focus-visible .back {
		transform: translateY(0);
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.face,
		.back {
			transition: none;
		}

		.stat-card:hover .face,
		.stat-card:focus-visible .face {
			transform: none;
			opacity: 0;
		}

		.stat-card:hover .back,
		.stat-card:focus-visible .back {
			transform: none;
		}
	}
</style>
