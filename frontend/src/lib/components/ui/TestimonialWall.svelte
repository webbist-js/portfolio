<script lang="ts">
	import type { Testimonial } from '$lib/strapi';

	let { testimonials }: { testimonials: Testimonial[] } = $props();

	const lead = $derived(testimonials.find((t) => t.featured) ?? testimonials[0]);
	const rest = $derived(testimonials.filter((t) => t !== lead));

	const attribution = (t: Testimonial) =>
		[t.role, t.company].filter(Boolean).join(', ') + (t.year ? ` · ${t.year}` : '');
</script>

<div class="wall">
	{#if lead}
		<figure class="lead">
			<blockquote class="serif">
				<span class="mark" aria-hidden="true">“</span>{lead.quote}
			</blockquote>
			<figcaption class="mono">
				<span class="name">{lead.author}</span>
				{#if attribution(lead)}<span class="role"> · {attribution(lead)}</span>{/if}
			</figcaption>
		</figure>
	{/if}
	{#if rest.length}
		<div class="rest">
			{#each rest as t (t.documentId)}
				<figure class="cell">
					<blockquote class="serif">{t.quote}</blockquote>
					<figcaption class="mono">
						<span class="name">{t.author}</span>
						{#if attribution(t)}<span class="role"> · {attribution(t)}</span>{/if}
					</figcaption>
				</figure>
			{/each}
		</div>
	{/if}
</div>

<style>
	.wall {
		border: 1px solid var(--ink);
		background: var(--white);
	}

	figure {
		margin: 0;
	}

	blockquote {
		margin: 0;
	}

	.lead {
		padding: 56px 64px;
	}

	.lead blockquote {
		font-size: clamp(24px, 3vw, 36px);
		line-height: 1.35;
		letter-spacing: -0.01em;
		color: var(--ink);
		max-width: 900px;
		position: relative;
	}

	.mark {
		color: var(--accent);
		margin-right: 4px;
	}

	figcaption {
		margin-top: 24px;
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.name {
		color: var(--ink);
		font-weight: 600;
	}

	.role {
		color: var(--muted);
	}

	.rest {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1px;
		background: var(--line);
		border-top: 1px solid var(--line);
	}

	.cell {
		background: var(--white);
		padding: 32px 36px 36px;
	}

	.cell blockquote {
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-2);
	}

	.cell figcaption {
		margin-top: 18px;
	}

	@media (max-width: 900px) {
		.lead {
			padding: 36px 28px;
		}

		.cell {
			padding: 28px;
		}
	}
</style>
