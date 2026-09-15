<script lang="ts">
	import { inlineSegments, paragraphs } from '$lib/inline';

	let { text }: { text: string } = $props();
</script>

{#each paragraphs(text) as para (para)}
	<p class="prose">
		{#each inlineSegments(para) as seg, i (i)}
			{#if seg.type === 'link'}<a href={seg.url} class="link accent" rel="noopener">{seg.text}</a
				>{:else if seg.type === 'code'}<code class="mono">{seg.text}</code>{:else}{seg.text}{/if}
		{/each}
	</p>
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

	code {
		font-size: 0.85em;
		background: var(--panel);
		border: 1px solid var(--line);
		padding: 1px 5px;
		white-space: nowrap;
	}
</style>
