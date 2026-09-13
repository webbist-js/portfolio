<script lang="ts">
	import type { Testimonial } from '$lib/strapi';

	let { testimonial }: { testimonial: Testimonial } = $props();
</script>

<figure class="testimonial-card">
	<blockquote>
		<p class="serif">{testimonial.quote}</p>
	</blockquote>
	<figcaption class="mono">
		<span class="author">{testimonial.author}</span>{#if testimonial.role}
			· {testimonial.role}{/if}{#if testimonial.company}, {testimonial.company}{/if}
	</figcaption>
</figure>

<style>
	.testimonial-card {
		margin: 0;
		padding: 32px;
		border: 1px solid var(--ink);
		background: var(--white);
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	blockquote {
		margin: 0;
		flex: 1;
	}

	blockquote p {
		font-size: 18px;
		line-height: 1.5;
		color: var(--ink);
	}

	figcaption {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.author {
		color: var(--ink);
	}
</style>
