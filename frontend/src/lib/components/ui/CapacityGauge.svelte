<script lang="ts">
	let {
		label = 'Capacity',
		openPercent = 0,
		segments = 13
	}: {
		label?: string;
		openPercent?: number;
		segments?: number;
	} = $props();

	const bookedCount = $derived(
		Math.min(segments, Math.max(0, Math.round(((100 - openPercent) / 100) * segments)))
	);
</script>

<div class="gauge">
	<div class="head">
		<span class="label mono">{label}</span>
		<span class="value">{openPercent}% open</span>
	</div>
	<div
		class="bar"
		role="img"
		aria-label="{label}: {openPercent}% open, {100 - openPercent}% booked"
	>
		{#each { length: segments }, i (i)}
			<div class="seg" class:filled={i < bookedCount} class:edge={i === bookedCount - 1}></div>
		{/each}
	</div>
</div>

<style>
	.gauge {
		padding: 18px;
		border: 1px solid var(--ink);
		background: var(--paper);
	}

	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 12px;
	}

	.label {
		font-size: 10px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.value {
		font-size: 14px;
		font-weight: 600;
		color: var(--ink);
	}

	.bar {
		display: flex;
		gap: 3px;
	}

	.seg {
		flex: 1;
		height: 24px;
		background: var(--line);
	}

	.seg.filled {
		background: var(--ink);
	}

	.seg.edge {
		background: repeating-linear-gradient(
			45deg,
			var(--ink),
			var(--ink) 2px,
			var(--accent) 2px,
			var(--accent) 4px
		);
	}
</style>
