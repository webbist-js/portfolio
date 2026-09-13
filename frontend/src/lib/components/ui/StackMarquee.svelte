<script lang="ts">
	import type { Tag } from '$lib/strapi';

	let { items }: { items: Tag[] } = $props();
</script>

<div class="marquee">
	<ul class="track">
		{#each items as t, i (t.label)}
			<li class:accent={i % 5 === 0}>
				{t.label} <span class="diamond" aria-hidden="true">◆</span>
			</li>
		{/each}
	</ul>
	<ul class="track" aria-hidden="true">
		{#each items as t, i (t.label)}
			<li class:accent={i % 5 === 0}>
				{t.label} <span class="diamond" aria-hidden="true">◆</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.marquee {
		display: flex;
		overflow: hidden;
		background: var(--dark);
		border-top: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
		padding: 22px 0;
	}

	.track {
		display: flex;
		gap: 56px;
		list-style: none;
		margin: 0;
		padding: 0 28px;
		white-space: nowrap;
		flex-shrink: 0;
		min-width: 100%;
		animation: marq 50s linear infinite;
	}

	li {
		display: flex;
		align-items: center;
		gap: 56px;
		font-size: 28px;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: var(--dark-text);
	}

	li.accent {
		color: var(--accent-on-dark);
	}

	.diamond {
		color: var(--ink-3);
		font-size: 18px;
	}

	@keyframes marq {
		from {
			transform: translateX(0);
		}

		to {
			transform: translateX(-100%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.track {
			animation: none;
		}

		.track[aria-hidden='true'] {
			display: none;
		}

		.marquee {
			overflow-x: auto;
		}
	}
</style>
