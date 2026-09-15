<script lang="ts">
	import type { FixBlock, FixQa } from '$lib/strapi';
	import CodeBlock from './CodeBlock.svelte';
	import FaqAccordion from './FaqAccordion.svelte';
	import FixCauses from './FixCauses.svelte';
	import Prose from './Prose.svelte';

	let { blocks }: { blocks: FixBlock[] } = $props();

	type Cause = Extract<FixBlock, { __component: 'fix.cause' }>;
	type Extra = Extract<FixBlock, { __component: 'article.code' | 'article.quote' | 'fix.note' }>;
	type Group =
		| {
				kind: 'section';
				num: number;
				kicker?: string | null;
				heading: string;
				body: string;
				extras: Extra[];
		  }
		| { kind: 'causes'; causes: Cause[] }
		| { kind: 'faq'; heading: string; items: FixQa[] };

	// Two-column rows: a section heading owns the code/note blocks that follow
	// it. Causes collapse into one explorer. Sections and causes share the
	// running index (00, causes 01–05, then 06 …).
	const groups = $derived.by(() => {
		const out: Group[] = [];
		let n = 0;
		for (const block of blocks) {
			const last = out[out.length - 1];
			if (block.__component === 'article.section') {
				out.push({
					kind: 'section',
					num: n++,
					kicker: block.kicker,
					heading: block.heading,
					body: block.body,
					extras: []
				});
			} else if (block.__component === 'fix.cause') {
				if (last?.kind === 'causes') last.causes.push(block);
				else out.push({ kind: 'causes', causes: [block] });
				n++;
			} else if (block.__component === 'fix.faq') {
				out.push({ kind: 'faq', heading: block.heading ?? 'Common questions', items: block.items });
			} else if (last?.kind === 'section') {
				last.extras.push(block);
			} else {
				out.push({ kind: 'section', num: n++, heading: '', body: '', extras: [block] });
			}
		}
		return out;
	});

	const pad = (x: number) => String(x).padStart(2, '0');
</script>

{#each groups as group, gi (gi)}
	{#if group.kind === 'causes'}
		<FixCauses causes={group.causes} />
	{:else if group.kind === 'faq'}
		<section class="row">
			<div class="side">
				<h2>{group.heading}</h2>
			</div>
			<div class="content">
				<FaqAccordion
					faqs={group.items.map((qa) => ({
						documentId: String(qa.id),
						question: qa.question,
						answer: qa.answer,
						order: 0
					}))}
				/>
			</div>
		</section>
	{:else}
		<section class="row">
			<div class="side">
				<p class="kicker mono">
					{pad(group.num)}{#if group.kicker}
						· {group.kicker}{/if}
				</p>
				{#if group.heading}<h2>{group.heading}</h2>{/if}
			</div>
			<div class="content">
				{#if group.body}<Prose text={group.body} />{/if}
				{#each group.extras as extra (extra.__component + extra.id)}
					{#if extra.__component === 'article.code'}
						<CodeBlock code={extra.code} language={extra.language} title={extra.title} />
					{:else if extra.__component === 'fix.note'}
						{#if extra.tone === 'warning'}
							<div class="callout">
								<span class="bang mono" aria-hidden="true">!</span>
								<div class="callout-body"><Prose text={extra.body} /></div>
							</div>
						{:else}
							<Prose text={extra.body} />
						{/if}
					{:else if extra.__component === 'article.quote'}
						<blockquote class="quote serif">
							<p>{extra.text}</p>
							{#if extra.attribution}<footer class="mono">— {extra.attribution}</footer>{/if}
						</blockquote>
					{/if}
				{/each}
			</div>
		</section>
	{/if}
{/each}

<style>
	.row {
		display: grid;
		grid-template-columns: minmax(240px, 340px) minmax(0, 1fr);
		gap: 64px;
		align-items: start;
		border-top: 1px solid var(--ink);
		padding: 48px 0 64px;
		margin-top: 64px;
	}

	.row + .row {
		margin-top: 0;
	}

	.kicker {
		font-size: 11px;
		color: var(--accent);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 14px;
	}

	.side h2 {
		font-size: clamp(26px, 2.8vw, 36px);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}

	.content :global(.code-block) {
		margin: 28px 0;
	}

	.content :global(.prose + .prose) {
		margin-top: 0;
	}

	.callout {
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr);
		align-items: start;
		background: var(--panel);
		border: 1px solid var(--line);
		padding: 18px 20px;
		margin-top: 28px;
	}

	.bang {
		color: var(--accent);
		font-size: 13px;
		padding-top: 2px;
	}

	.callout-body :global(.prose) {
		font-size: 14px;
		line-height: 1.6;
		margin-bottom: 0;
	}

	.quote {
		margin: 40px 0 0;
		padding-left: 28px;
		border-left: 3px solid var(--accent);
		font-size: 26px;
		line-height: 1.35;
		letter-spacing: -0.01em;
	}

	.quote p {
		margin: 0;
	}

	.quote footer {
		font-style: normal;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-top: 16px;
	}

	@media (max-width: 900px) {
		.row {
			grid-template-columns: 1fr;
			gap: 28px;
			padding: 40px 0 48px;
		}
	}
</style>
