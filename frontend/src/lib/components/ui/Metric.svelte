<script lang="ts">
	let {
		value,
		label,
		size = 'md'
	}: {
		value: string;
		label: string;
		size?: 'sm' | 'md' | 'lg';
	} = $props();
</script>

<div class="metric {size}">
	<div class="value">{value}</div>
	<div class="label mono">{label}</div>
</div>

<style>
	.value {
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 0.95;
	}

	.metric.sm .value {
		font-size: 32px;
	}

	.metric.md .value {
		font-size: 48px;
	}

	.metric.lg .value {
		font-size: clamp(40px, 5vw, 64px);
		letter-spacing: -0.04em;
	}

	.label {
		font-size: 11px;
		color: var(--muted);
		margin-top: 8px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
