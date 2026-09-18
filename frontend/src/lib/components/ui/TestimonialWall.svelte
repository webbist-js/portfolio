<script lang="ts">
	import type { Testimonial } from '$lib/strapi';

	let {
		testimonials,
		recommendationsUrl,
		interval = 9000
	}: { testimonials: Testimonial[]; recommendationsUrl?: string; interval?: number } = $props();

	// The featured quote leads; everything else keeps its CMS order.
	const items = $derived(
		[...testimonials].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
	);

	let index = $state(0);
	// Auto-advance stops for good the moment someone steers it themselves; the
	// play/pause control is the only thing that turns it back on (WCAG 2.2.2).
	let running = $state(true);
	let hovering = $state(false);
	let reduced = $state(false);
	let tabs: HTMLButtonElement[] = [];

	// Keyed on the document rather than a plain boolean, so stepping along the
	// rail collapses the expansion without a separate reset.
	let openFor = $state<string | null>(null);

	const current = $derived(items[Math.min(index, items.length - 1)]);
	const advancing = $derived(running && !reduced && items.length > 1);
	const expanded = $derived(Boolean(current) && openFor === current.documentId);

	const pad = (n: number) => String(n).padStart(2, '0');

	const paragraphs = (text: string) =>
		text
			.split(/\n\s*\n/)
			.map((para) => para.trim())
			.filter(Boolean);

	// A full recommendation takes longer to read than the interval, so opening one
	// stops the carousel; the play control is the only way back (WCAG 2.2.2).
	const toggleFull = () => {
		if (!current) return;
		const opening = !expanded;
		openFor = opening ? current.documentId : null;
		if (opening) running = false;
	};

	const attribution = (t: Testimonial) =>
		[[t.role, t.company].filter(Boolean).join(', '), t.year].filter(Boolean).join(' · ');

	const select = (i: number) => {
		index = (i + items.length) % items.length;
		running = false;
	};

	const step = (delta: number) => select(index + delta);

	const onRailKeydown = (event: KeyboardEvent, i: number) => {
		const moves: Record<string, number> = {
			ArrowDown: i + 1,
			ArrowRight: i + 1,
			ArrowUp: i - 1,
			ArrowLeft: i - 1,
			Home: 0,
			End: items.length - 1
		};
		if (!(event.key in moves)) return;
		event.preventDefault();
		const next = (moves[event.key] + items.length) % items.length;
		select(next);
		tabs[next]?.focus();
	};

	$effect(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => (reduced = query.matches);
		sync();
		query.addEventListener('change', sync);
		return () => query.removeEventListener('change', sync);
	});

	$effect(() => {
		if (!advancing || hovering) return;
		// Reading index here restarts the timer on every change, manual or not.
		const from = index;
		const timer = setTimeout(() => {
			index = (from + 1) % items.length;
		}, interval);
		return () => clearTimeout(timer);
	});
</script>

{#if current}
	<!-- Hovering only pauses the timer; it never changes which quote is showing. -->
	<div
		class="voices"
		role="group"
		aria-label="Testimonials"
		onmouseenter={() => (hovering = true)}
		onmouseleave={() => (hovering = false)}
		onfocusin={() => (hovering = true)}
		onfocusout={() => (hovering = false)}
	>
		<div class="rail">
			<div class="rail-head mono">
				<span>Voices</span>
				<span class="count">{items.length}</span>
			</div>
			<div class="rail-list" role="tablist" aria-orientation="vertical" aria-label="Voices">
				{#each items as t, i (t.documentId)}
					<button
						type="button"
						role="tab"
						id="voice-tab-{t.documentId}"
						aria-controls="voice-panel"
						aria-selected={i === index}
						tabindex={i === index ? 0 : -1}
						bind:this={tabs[i]}
						onclick={() => select(i)}
						onkeydown={(e) => onRailKeydown(e, i)}
					>
						<span class="idx mono" aria-hidden="true">{pad(i + 1)}</span>
						<span class="who">
							<span class="name">{t.author}</span>
							{#if t.company || t.role}<span class="org mono">{t.company ?? t.role}</span>{/if}
						</span>
						{#if t.linkedinRecommendation}
							<span class="public-mark" aria-hidden="true"></span>
							<span class="sr-only">Public LinkedIn recommendation</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<div class="stage">
			<div
				class="quote"
				id="voice-panel"
				role="tabpanel"
				tabindex="0"
				aria-labelledby="voice-tab-{current.documentId}"
			>
				{#key current.documentId}
					<div class="quote-body">
						<figure class="quote-figure">
							<span class="mark serif" aria-hidden="true">“</span>
							<blockquote class="serif">{current.quote}</blockquote>
							<figcaption class="mono">
								<span class="name">{current.author}</span>
								{#if attribution(current)}<span class="role"> · {attribution(current)}</span>{/if}
							</figcaption>
						</figure>

						{#if current.fullQuote || (current.linkedinRecommendation && recommendationsUrl)}
							<div class="provenance mono">
								{#if current.fullQuote}
									<button
										type="button"
										class="disclose"
										aria-expanded={expanded}
										aria-controls="voice-full-{current.documentId}"
										onclick={toggleFull}
									>
										<span class="sign" aria-hidden="true">{expanded ? '−' : '+'}</span>
										{expanded ? 'Hide the full recommendation' : 'Read the full recommendation'}
									</button>
								{/if}
								{#if current.linkedinRecommendation && recommendationsUrl}
									<a class="verify" href={recommendationsUrl} target="_blank" rel="noopener">
										Verified on LinkedIn <span aria-hidden="true">↗</span>
									</a>
								{/if}
							</div>
						{/if}

						{#if current.fullQuote}
							<div class="full" id="voice-full-{current.documentId}" hidden={!expanded}>
								{#each paragraphs(current.fullQuote) as para, i (i)}
									<p>{para}</p>
								{/each}
							</div>
						{/if}
					</div>
				{/key}
			</div>

			<div class="controls">
				<p class="counter mono">
					<span class="now">{pad(index + 1)}</span>
					<span class="of">/</span>
					<span class="of">{pad(items.length)}</span>
				</p>
				<div class="ticks" aria-hidden="true">
					{#each items as t, i (t.documentId)}
						<span class="tick" class:past={i < index} class:now={i === index}></span>
					{/each}
				</div>
				<div class="arrows">
					{#if !reduced && items.length > 1}
						<button
							type="button"
							class="nav"
							aria-label={running ? 'Pause auto-advance' : 'Play testimonials automatically'}
							onclick={() => (running = !running)}
						>
							<span aria-hidden="true">{running ? '❙❙' : '▶'}</span>
						</button>
					{/if}
					<button
						type="button"
						class="nav"
						aria-label="Previous testimonial"
						onclick={() => step(-1)}
					>
						<span aria-hidden="true">←</span>
					</button>
					<button type="button" class="nav" aria-label="Next testimonial" onclick={() => step(1)}>
						<span aria-hidden="true">→</span>
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.voices {
		display: grid;
		grid-template-columns: minmax(240px, 300px) 1fr;
		border: 1px solid var(--ink);
		background: var(--white);
	}

	/* Rail */

	.rail {
		border-right: 1px solid var(--ink);
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.rail-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding: 18px 24px;
		border-bottom: 1px solid var(--line);
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.count {
		color: var(--ink);
	}

	.rail-list {
		display: flex;
		flex-direction: column;
	}

	[role='tab'] {
		display: flex;
		align-items: baseline;
		gap: 16px;
		width: 100%;
		padding: 16px 24px;
		background: none;
		border: 0;
		border-bottom: 1px solid var(--line);
		border-left: 2px solid transparent;
		text-align: left;
		cursor: pointer;
		transition: background-color var(--duration-quick) var(--ease-out);
	}

	[role='tab']:last-child {
		border-bottom: 0;
	}

	[role='tab']:hover {
		background: var(--panel);
	}

	[role='tab'][aria-selected='true'] {
		border-left-color: var(--accent);
	}

	.idx {
		font-size: 11px;
		letter-spacing: 0.08em;
		color: var(--muted);
	}

	[role='tab'][aria-selected='true'] .idx {
		color: var(--accent);
	}

	.who {
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
	}

	.who .name {
		font-size: 15px;
		color: var(--ink-2);
		letter-spacing: -0.01em;
	}

	[role='tab'][aria-selected='true'] .who .name {
		color: var(--ink);
		font-weight: 600;
	}

	.org {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.04em;
	}

	/* Marks the entries a reader can check on LinkedIn. Redundant with the link
	   in the stage and with the visually-hidden label, so it never carries the
	   meaning on colour alone. */
	.public-mark {
		width: 5px;
		height: 5px;
		margin-left: auto;
		align-self: center;
		flex-shrink: 0;
		background: var(--line);
		transition: background-color var(--duration-quick) var(--ease-out);
	}

	[role='tab'][aria-selected='true'] .public-mark {
		background: var(--accent);
	}

	/* Stage */

	.stage {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.quote {
		flex: 1;
		padding: 56px 64px 40px;
	}

	.quote-figure {
		margin: 0;
	}

	.quote-body {
		position: relative;
		padding-left: 52px;
		max-width: 900px;
		animation: rise var(--duration-fast) var(--ease-smooth-out) both;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(var(--distance-base));
		}
	}

	.mark {
		position: absolute;
		left: 0;
		top: -0.1em;
		font-size: 40px;
		line-height: 1;
		color: var(--accent);
	}

	blockquote {
		margin: 0;
		font-size: clamp(22px, 2.5vw, 34px);
		line-height: 1.35;
		letter-spacing: -0.01em;
		color: var(--ink);
	}

	figcaption {
		margin-top: 28px;
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	figcaption .name {
		color: var(--ink);
		font-weight: 600;
	}

	.role {
		color: var(--muted);
	}

	/* Provenance */

	.provenance {
		display: flex;
		align-items: center;
		gap: 24px;
		flex-wrap: wrap;
		margin-top: 20px;
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.disclose,
	.verify {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 0;
		background: none;
		border: 0;
		border-bottom: 1px solid var(--line);
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		color: var(--muted);
		text-decoration: none;
		cursor: pointer;
		transition:
			color var(--duration-quick) var(--ease-out),
			border-color var(--duration-quick) var(--ease-out);
	}

	.disclose:hover,
	.verify:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.sign {
		font-size: 13px;
		line-height: 1;
		color: var(--accent);
	}

	.full {
		margin-top: 28px;
		padding-top: 24px;
		border-top: 1px solid var(--line);
		max-width: 68ch;
	}

	.full p {
		margin: 0 0 1em;
		font-size: 15px;
		line-height: 1.65;
		color: var(--ink-2);
	}

	.full p:last-child {
		margin-bottom: 0;
	}

	/* Controls */

	.controls {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 16px 20px 16px 32px;
		border-top: 1px solid var(--line);
	}

	.counter {
		display: flex;
		gap: 5px;
		font-size: 12px;
		letter-spacing: 0.08em;
		flex-shrink: 0;
	}

	.counter .now {
		color: var(--ink);
	}

	.of {
		color: var(--muted);
	}

	.ticks {
		display: flex;
		align-items: center;
		gap: 6px;
		flex: 1;
		min-width: 0;
	}

	.tick {
		height: 3px;
		flex: 1;
		background: var(--line);
		transition: background-color var(--duration-fast) var(--ease-out);
	}

	.tick.past {
		background: var(--muted-loud);
	}

	.tick.now {
		background: var(--accent);
	}

	.arrows {
		display: flex;
		gap: 8px;
		flex-shrink: 0;
	}

	.nav {
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		background: none;
		border: 1px solid var(--line);
		font-size: 14px;
		color: var(--ink);
		cursor: pointer;
		transition:
			background-color var(--duration-quick) var(--ease-out),
			border-color var(--duration-quick) var(--ease-out),
			color var(--duration-quick) var(--ease-out);
	}

	.nav:hover {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--dark-text);
	}

	@media (max-width: 900px) {
		.voices {
			grid-template-columns: 1fr;
		}

		.rail {
			border-right: 0;
			border-bottom: 1px solid var(--ink);
		}

		.rail-list {
			flex-direction: row;
			overflow-x: auto;
		}

		[role='tab'] {
			width: auto;
			flex-shrink: 0;
			padding: 12px 20px;
			border-bottom: 0;
			border-left: 0;
			border-right: 1px solid var(--line);
			border-top: 2px solid transparent;
		}

		[role='tab']:last-child {
			border-right: 0;
		}

		[role='tab'][aria-selected='true'] {
			border-top-color: var(--accent);
		}

		.quote {
			padding: 32px 24px 28px;
		}

		.quote-body {
			padding-left: 0;
		}

		.provenance {
			gap: 14px;
			margin-top: 18px;
		}

		.mark {
			position: static;
			display: block;
			font-size: 32px;
			line-height: 0.8;
			margin-bottom: 10px;
		}

		.controls {
			padding: 12px 16px;
			gap: 16px;
		}

		.nav {
			width: 40px;
			height: 40px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.quote-body {
			animation: none;
		}
	}
</style>
