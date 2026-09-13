<script lang="ts">
	let {
		title = 'At a glance',
		items
	}: {
		title?: string;
		items: { key: string; value: string }[];
	} = $props();
</script>

<div class="glance">
	<div class="glance-title mono">{title}</div>
	<dl class="mono">
		{#each items as item (item.key)}
			<div>
				<dt>{item.key}:</dt>
				<dd>{item.value}</dd>
			</div>
		{/each}
	</dl>
</div>

<style>
	.glance {
		padding: 24px;
		background: var(--dark);
		color: var(--dark-text);
		border: 1px solid var(--dark);
	}

	.glance-title {
		font-size: 11px;
		font-weight: 500;
		color: var(--accent-on-dark);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin: 0 0 12px;
	}

	dl {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin: 0;
		font-size: 12px;
	}

	dt {
		color: var(--dark-muted);
	}

	dd {
		margin: 2px 0 0;
		font-size: 14px;
		color: var(--dark-text);
		overflow-wrap: anywhere;
	}
</style>
