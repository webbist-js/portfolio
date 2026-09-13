<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="empty-state mono">{@render children()}</div>

<style>
	.empty-state {
		padding: 80px 0;
		text-align: center;
		color: var(--muted);
		font-size: 13px;
		line-height: 1.8;
	}
</style>
