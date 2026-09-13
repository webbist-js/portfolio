<script lang="ts">
	import type { Metric as MetricType } from '$lib/strapi';
	import Metric from './Metric.svelte';

	let {
		metrics,
		size = 'lg',
		class: cls = ''
	}: {
		metrics: MetricType[];
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	} = $props();
</script>

{#if metrics.length}
	<div class="metric-strip {cls}" style="--cols: {metrics.length}">
		{#each metrics as m (m.label)}
			<div class="cell">
				<Metric value={m.value} label={m.label} {size} />
			</div>
		{/each}
	</div>
{/if}

<style>
	.metric-strip {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		border-top: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
	}

	.cell {
		padding: 32px 28px;
		border-right: 1px solid var(--line);
	}

	.cell:last-child {
		border-right: none;
	}

	@media (max-width: 720px) {
		.metric-strip {
			grid-template-columns: 1fr 1fr;
		}

		.cell {
			border-bottom: 1px solid var(--line);
		}
	}
</style>
