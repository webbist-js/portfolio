<script lang="ts">
	import { inlineSegments, listBlock, paragraphs, type ListBlock } from '$lib/inline';

	let { text }: { text: string } = $props();
</script>

{#snippet inline(t: string)}
	{#each inlineSegments(t) as seg, i (i)}
		{#if seg.type === 'link'}<a href={seg.url} class="link accent" rel="noopener">{seg.text}</a
			>{:else if seg.type === 'code'}<code class="mono">{seg.text}</code
			>{:else if seg.type === 'bold'}<strong>{seg.text}</strong>{:else}{seg.text}{/if}
	{/each}
{/snippet}

{#snippet items(list: ListBlock)}
	{#each list.items as item, j (j)}
		<li>{@render inline(item)}</li>
	{/each}
{/snippet}

{#each paragraphs(text) as block, i (i)}
	{@const list = listBlock(block)}
	{#if list?.ordered}
		<ol class="prose-list prose-ol">{@render items(list)}</ol>
	{:else if list}
		<ul class="prose-list">{@render items(list)}</ul>
	{:else}
		<p class="prose">{@render inline(block)}</p>
	{/if}
{/each}

<style>
	.prose {
		font-size: 16px;
		line-height: 1.7;
		color: var(--ink-2);
		margin: 0 0 20px;
	}

	.prose:last-child {
		margin-bottom: 0;
	}

	.prose-list {
		list-style: none;
		margin: 0 0 20px;
		padding: 0;
	}

	.prose-list:last-child {
		margin-bottom: 0;
	}

	.prose-list li {
		position: relative;
		font-size: 16px;
		line-height: 1.7;
		color: var(--ink-2);
		padding-left: 22px;
		margin-bottom: 8px;
	}

	.prose-list li:last-child {
		margin-bottom: 0;
	}

	.prose-list li::before {
		content: '';
		position: absolute;
		left: 2px;
		top: 0.62em;
		width: 6px;
		height: 6px;
		background: var(--accent);
	}

	/* Numbered lists keep their real markers: list-style: none drops list
	   semantics in some screen readers, and a CSS counter is not announced. */
	.prose-ol {
		list-style: decimal;
		padding-left: 26px;
	}

	.prose-ol li {
		padding-left: 4px;
	}

	.prose-ol li::before {
		content: none;
	}

	.prose-ol li::marker {
		font-family: var(--font-mono);
		font-size: 13px;
		color: var(--accent);
	}

	strong {
		font-weight: 600;
		color: var(--ink);
	}

	code {
		font-size: 0.85em;
		background: var(--panel);
		border: 1px solid var(--line);
		padding: 1px 5px;
		white-space: nowrap;
	}
</style>
