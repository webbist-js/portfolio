<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		href,
		variant = 'primary',
		size = 'md',
		type = 'button',
		onclick,
		class: cls = '',
		children
	}: {
		href?: string;
		variant?: 'primary' | 'ghost' | 'accent' | 'dark-outline';
		size?: 'sm' | 'md';
		type?: 'button' | 'submit';
		onclick?: (e: MouseEvent) => void;
		class?: string;
		children: Snippet;
	} = $props();
</script>

{#if href}
	<!-- Callers pass pre-resolved or external (mailto:) hrefs. -->
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a {href} class="btn {variant} {size} {cls}">{@render children()}</a>
{:else}
	<button {type} {onclick} class="btn {variant} {size} {cls}">{@render children()}</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 14px 22px;
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 500;
		border: 1px solid transparent;
		cursor: pointer;
		transition:
			background 200ms,
			color 200ms,
			border-color 200ms;
	}

	.btn.sm {
		padding: 10px 16px;
		font-size: 13px;
	}

	.btn.primary {
		background: var(--ink);
		color: var(--dark-text);
		border-color: var(--ink);
	}

	.btn.primary:hover {
		background: var(--accent-solid);
		border-color: var(--accent-solid);
	}

	.btn.ghost {
		background: transparent;
		color: var(--ink);
		border-color: var(--ink);
	}

	.btn.ghost:hover {
		background: var(--ink);
		color: var(--dark-text);
	}

	.btn.accent {
		background: var(--accent-solid);
		color: var(--dark-text);
		border-color: var(--accent-solid);
	}

	.btn.accent:hover {
		background: var(--ink);
		border-color: var(--ink);
	}

	.btn.dark-outline {
		background: transparent;
		color: var(--dark-text);
		border-color: var(--dark-text);
	}

	.btn.dark-outline:hover {
		background: var(--dark-text);
		color: var(--ink);
	}
</style>
