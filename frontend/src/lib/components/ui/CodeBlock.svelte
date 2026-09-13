<script lang="ts">
	let {
		code,
		language,
		title
	}: {
		code: string;
		language?: string | null;
		title?: string | null;
	} = $props();
</script>

<div class="code-block">
	<div class="chrome mono">
		<span class="dots" aria-hidden="true">
			<span class="dot red"></span><span class="dot amber"></span><span class="dot green"></span>
		</span>
		{#if title}<span class="title">{title}</span>{/if}
		{#if language}<span class="lang">{language}</span>{/if}
	</div>
	<!-- Horizontally scrollable region: axe's scrollable-region-focusable rule
	     requires keyboard reachability, which role="region" + label makes valid. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<pre
		tabindex="0"
		role="region"
		aria-label={title ?? `Code sample${language ? ` (${language})` : ''}`}><code>{code}</code></pre>
</div>

<style>
	.code-block {
		background: var(--ink);
		border: 1px solid var(--ink);
		margin: 40px 0;
	}

	.chrome {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 16px;
		border-bottom: 1px solid var(--dark-line, #2a2a28);
		font-size: 10px;
		letter-spacing: 0.08em;
	}

	.dots {
		display: inline-flex;
		gap: 5px;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.dot.red {
		background: #ff5f57;
	}

	.dot.amber {
		background: #febc2e;
	}

	.dot.green {
		background: #28c840;
	}

	.title {
		color: var(--dark-muted, #9a9a92);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.lang {
		margin-left: auto;
		color: var(--accent-on-dark, #7d97ff);
		text-transform: uppercase;
	}

	pre {
		margin: 0;
		padding: 20px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 13px;
		line-height: 1.65;
		color: var(--dark-text, #fafaf7);
	}

	pre:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -2px;
	}

	code {
		font-family: inherit;
	}
</style>
