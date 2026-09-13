<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tone = 'default',
		class: cls = '',
		children
	}: {
		tone?: 'default' | 'accent' | 'on-dark' | 'accent-on-dark';
		class?: string;
		children: Snippet;
	} = $props();
</script>

<span class="mono-label {tone} {cls}">{@render children()}</span>

<style>
	.mono-label {
		display: block;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.mono-label.accent {
		color: var(--accent);
	}

	.mono-label.on-dark {
		color: var(--dark-muted);
	}

	.mono-label.accent-on-dark {
		color: var(--accent-on-dark);
	}
</style>
