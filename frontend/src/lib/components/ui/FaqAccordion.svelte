<script lang="ts">
	import type { Faq } from '$lib/strapi';

	let { faqs }: { faqs: Faq[] } = $props();

	let open = $state<string | null>(null);

	const toggle = (id: string) => {
		open = open === id ? null : id;
	};
</script>

<div class="faqs">
	{#each faqs as faq (faq.documentId)}
		{@const isOpen = open === faq.documentId}
		<div class="faq">
			<h3>
				<button
					type="button"
					aria-expanded={isOpen}
					aria-controls="faq-panel-{faq.documentId}"
					id="faq-button-{faq.documentId}"
					onclick={() => toggle(faq.documentId)}
				>
					<span>{faq.question}</span>
					<span class="glyph mono" aria-hidden="true">{isOpen ? '−' : '+'}</span>
				</button>
			</h3>
			<div
				id="faq-panel-{faq.documentId}"
				role="region"
				aria-labelledby="faq-button-{faq.documentId}"
				hidden={!isOpen}
			>
				<p>{faq.answer}</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.faqs {
		border-top: 1px solid var(--ink);
	}

	.faq {
		border-bottom: 1px solid var(--line);
	}

	h3 {
		margin: 0;
	}

	button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
		width: 100%;
		padding: 24px 0;
		background: none;
		border: 0;
		text-align: left;
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: clamp(17px, 2vw, 22px);
		font-weight: 500;
		color: var(--ink);
		letter-spacing: -0.015em;
		transition: color 200ms;
	}

	button:hover {
		color: var(--accent);
	}

	.glyph {
		font-size: 18px;
		color: var(--accent);
		flex-shrink: 0;
	}

	[role='region'] p {
		font-size: 15px;
		color: var(--ink-3);
		line-height: 1.65;
		margin: 0 0 24px;
		max-width: 760px;
	}
</style>
