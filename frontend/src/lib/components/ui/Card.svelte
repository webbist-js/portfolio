<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tone = 'default',
		class: cls = '',
		children
	}: {
		tone?: 'default' | 'panel' | 'dark';
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class="card {tone} {cls}">{@render children()}</div>

<style>
	.card {
		border: 1px solid var(--ink);
		background: var(--white);
		padding: 32px;
	}

	.card.panel {
		background: var(--panel);
		border-color: var(--line);
	}

	.card.dark {
		background: var(--dark);
		color: var(--dark-text);
		border-color: var(--dark);
	}
</style>
