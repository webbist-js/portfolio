<script lang="ts">
	let {
		quote,
		author,
		role,
		company,
		year
	}: {
		quote: string;
		author?: string;
		role?: string;
		company?: string;
		year?: string;
	} = $props();
</script>

<figure class="pull-quote">
	<div class="mark mono" aria-hidden="true">"</div>
	<blockquote>
		<p class="serif">{quote}</p>
	</blockquote>
	{#if author}
		<figcaption class="mono">
			<span class="author">{author}</span>{#if role}
				· {role}{/if}{#if company}, {company}{/if}{#if year}
				· {year}{/if}
		</figcaption>
	{/if}
</figure>

<style>
	.pull-quote {
		margin: 0;
		text-align: center;
	}

	.mark {
		font-size: 90px;
		color: var(--accent);
		line-height: 0.5;
		margin-bottom: 24px;
	}

	blockquote {
		margin: 0;
	}

	blockquote p {
		font-size: clamp(24px, 3vw, 36px);
		line-height: 1.3;
		letter-spacing: -0.01em;
		color: var(--ink);
		max-width: 880px;
		margin: 0 auto;
	}

	figcaption {
		margin-top: 32px;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.author {
		color: var(--ink);
	}
</style>
