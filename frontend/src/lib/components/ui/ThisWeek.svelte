<script module lang="ts">
	export interface ThisWeekItem {
		text: string;
		/** Optional mono-styled prefix, e.g. a repo or package name. */
		code?: string;
		href?: string;
		highlight?: boolean;
	}
</script>

<script lang="ts">
	import MonoLabel from './MonoLabel.svelte';

	let { items, limit = 3 }: { items: ThisWeekItem[]; limit?: number } = $props();

	const shown = $derived(items.slice(0, limit));
</script>

<div class="this-week">
	<MonoLabel class="this-week-label">This week</MonoLabel>
	<ul>
		{#each shown as item (item.text)}
			<li>
				<span class="week-dot" class:highlight={item.highlight} aria-hidden="true"></span>
				<span class="week-text">
					{#if item.code}<code class="mono">{item.code}</code>{/if}
					{#if item.href}
						<a href={item.href} class="link">{item.text}</a>
					{:else}
						{item.text}
					{/if}
				</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.this-week {
		border-left: 1px solid var(--line);
		padding-left: 28px;
	}

	:global(.this-week-label) {
		margin-bottom: 14px;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	li {
		display: flex;
		gap: 10px;
		align-items: baseline;
		font-size: 14px;
		line-height: 1.5;
	}

	.week-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink);
		flex-shrink: 0;
		position: relative;
		top: -2px;
	}

	.week-dot.highlight {
		background: var(--accent);
	}

	.week-text code {
		font-size: 12px;
		background: var(--panel);
		border: 1px solid var(--line);
		padding: 1px 6px;
		margin-right: 4px;
	}
</style>
