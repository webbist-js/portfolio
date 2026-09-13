<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		class: cls = '',
		children
	}: {
		variant?: 'default' | 'solid' | 'accent';
		class?: string;
		children: Snippet;
	} = $props();
</script>

<span class="tag {variant} {cls}">{@render children()}</span>

<style>
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		background: var(--white);
		border: 1px solid var(--line);
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--ink-3);
		white-space: nowrap;
	}

	.tag.solid {
		background: var(--ink);
		color: var(--dark-text);
		border-color: var(--ink);
	}

	.tag.accent {
		background: var(--accent-solid);
		color: var(--dark-text);
		border-color: var(--accent-solid);
	}
</style>
