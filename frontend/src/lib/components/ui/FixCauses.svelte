<script lang="ts">
	import type { FixBlock } from '$lib/strapi';
	import CodeBlock from './CodeBlock.svelte';
	import Prose from './Prose.svelte';

	type Cause = Extract<FixBlock, { __component: 'fix.cause' }>;

	let { causes }: { causes: Cause[] } = $props();

	let active = $state(0);

	const pad = (n: number) => String(n).padStart(2, '0');
	const CELLS = [0, 1, 2, 3, 4];
	const bars = (cause: Cause, i: number) =>
		Math.min(5, Math.max(1, cause.likelihood ?? causes.length - i));
	const isFix = (label: string) => /fix/i.test(label);
</script>

<section class="row">
	<div class="side">
		<p class="label mono">Likely causes · Most → least common</p>
		<div class="selector" role="tablist" aria-label="Likely causes">
			{#each causes as cause, i (cause.id)}
				<button
					type="button"
					role="tab"
					id="cause-tab-{cause.id}"
					aria-selected={active === i}
					aria-controls="cause-panel-{cause.id}"
					class="option mono"
					class:active={active === i}
					onclick={() => (active = i)}
				>
					<span class="num">{pad(i + 1)}</span>
					<span class="name">{cause.title}</span>
					<span class="bars" aria-hidden="true">
						{#each CELLS as b (b)}
							<span class="bar" class:filled={b < bars(cause, i)}></span>
						{/each}
					</span>
					<span class="visually-hidden">likelihood {bars(cause, i)} of 5</span>
				</button>
			{/each}
		</div>
		<p class="barnote mono">bars = how often this is the answer</p>
	</div>

	<div class="content">
		{#each causes as cause, i (cause.id)}
			<div
				id="cause-panel-{cause.id}"
				role="tabpanel"
				aria-labelledby="cause-tab-{cause.id}"
				hidden={active !== i}
			>
				<p class="kicker mono">Cause {pad(i + 1)} of {pad(causes.length)}</p>
				<h2>{cause.title}</h2>
				{#each cause.aspects as aspect (aspect.id)}
					<div class="aspect">
						<span class="aspect-label mono" class:accent={isFix(aspect.label)}>{aspect.label}</span>
						<div class="aspect-body">
							<Prose text={aspect.body} />
							{#if aspect.code}
								<CodeBlock code={aspect.code} language={aspect.codeLanguage} />
							{/if}
							{#if aspect.after}
								<Prose text={aspect.after} />
							{/if}
						</div>
					</div>
				{/each}
				<div class="pager mono">
					<button
						type="button"
						class="pager-btn"
						disabled={active === 0}
						onclick={() => (active = Math.max(0, active - 1))}>← Previous</button
					>
					{#if active < causes.length - 1}
						<button type="button" class="pager-btn next" onclick={() => (active = active + 1)}
							>Not this one → Next cause</button
						>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</section>

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

	.label {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 18px;
	}

	.selector {
		border: 1px solid var(--ink);
	}

	.option {
		display: grid;
		grid-template-columns: 28px 1fr 46px;
		gap: 12px;
		align-items: center;
		width: 100%;
		text-align: left;
		padding: 14px 14px;
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--line);
		font-size: 12px;
		color: var(--ink);
		cursor: pointer;
		transition: background 200ms;
	}

	.option:last-child {
		border-bottom: 0;
	}

	.option:hover {
		background: var(--panel);
	}

	.option.active {
		background: var(--dark);
		color: var(--dark-text);
	}

	.option .num {
		font-size: 11px;
		color: var(--muted);
	}

	.option.active .num {
		color: var(--dark-muted);
	}

	.option .name {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 500;
		line-height: 1.3;
	}

	.bars {
		display: inline-flex;
		gap: 2px;
		justify-self: end;
	}

	.bar {
		width: 5px;
		height: 12px;
		background: var(--line);
	}

	.bar.filled {
		background: var(--accent);
	}

	.barnote {
		font-size: 10px;
		color: var(--muted);
		letter-spacing: 0.05em;
		margin-top: 12px;
	}

	.kicker {
		font-size: 11px;
		color: var(--accent);
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	h2 {
		font-size: clamp(30px, 3.4vw, 44px);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.05;
		margin: 12px 0 8px;
	}

	.aspect {
		display: grid;
		grid-template-columns: 130px minmax(0, 1fr);
		gap: 28px;
		padding: 24px 0;
		border-top: 1px solid var(--line);
		margin-top: 8px;
	}

	.aspect:first-of-type {
		border-top: 0;
	}

	.aspect-label {
		font-size: 10px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding-top: 4px;
	}

	.aspect-label.accent {
		color: var(--accent);
	}

	.aspect-body :global(.code-block) {
		margin: 20px 0 4px;
	}

	.pager {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		border-top: 1px solid var(--line);
		padding-top: 20px;
		margin-top: 16px;
	}

	.pager-btn {
		background: transparent;
		border: 0;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
		cursor: pointer;
		padding: 0;
		transition: color 200ms;
	}

	.pager-btn.next {
		color: var(--accent);
	}

	.pager-btn:hover:not(:disabled) {
		color: var(--ink);
	}

	.pager-btn.next:hover {
		color: var(--accent-solid, var(--accent));
	}

	.pager-btn:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	@media (max-width: 900px) {
		.row {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		.aspect {
			grid-template-columns: 1fr;
			gap: 10px;
		}
	}
</style>
