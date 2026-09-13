<script lang="ts">
	import {
		Button,
		ContactForm,
		CtaBand,
		EmptyState,
		GlanceCard,
		MonoLabel,
		PageHero,
		SectionHead,
		Seo,
		Tag,
		Timeline
	} from '$lib/components';

	import { personJsonLd } from '$lib/seo';

	let { data, form } = $props();

	const g = $derived(data.global);

	const glanceItems = $derived(
		[
			g?.location ? { key: 'based', value: g.location } : null,
			g?.timezone ? { key: 'tz', value: g.timezone } : null,
			g?.email ? { key: 'email', value: g.email } : null,
			g?.availabilityNote ? { key: 'availability', value: g.availabilityNote } : null
		].filter((i): i is { key: string; value: string } => i !== null)
	);

	const yearsActive = $derived.by(() => {
		const starts = (data.experiences ?? [])
			.map((e) => parseInt(e.years, 10))
			.filter((n) => !Number.isNaN(n));
		if (!starts.length) return null;
		return new Date().getFullYear() - Math.min(...starts);
	});
</script>

<Seo
	title={`About — ${data.global?.name ?? 'Portfolio'}`}
	description="Twenty years in the JS ecosystem: career timeline, operating principles, and how I work."
	jsonLd={personJsonLd(data.global)}
/>

<PageHero
	kicker="About{yearsActive ? ` · ${yearsActive} years in` : ''}"
	lede="I've spent my career building content platforms — first at agencies, then at a headless commerce studio, now at Strapi. The tools have changed; the work hasn't. It's still mostly about the conversations between engineers and editors that decide whether a system gets used or worked around."
>
	{#snippet title()}
		One engineer.<br /><span class="accent">Two decades.</span>
	{/snippet}
</PageHero>

<section class="profile-section">
	<div class="profile-col">
		<MonoLabel class="col-label">Profile</MonoLabel>
		<p class="statement">
			I'm drawn to the unglamorous middle layer — where a team's architecture decisions quietly
			compound into either leverage or debt.
		</p>
		<p class="bio">
			Started building websites when Flash still seemed like a good idea. Moved through agency life,
			product studios, and a headless commerce agency where I built and led a 12-engineer Strapi +
			Next.js practice. Joined Strapi as Implementation Manager.
		</p>
		<p class="bio">
			I focus on enterprise rollouts — content modelling, Next.js integration patterns, plugin
			architecture, and the dozen organisational decisions that decide whether a headless project
			ships or stalls.
		</p>

		{#if g?.stack?.length}
			<div class="stack-card">
				<MonoLabel class="stack-label">Stack</MonoLabel>
				<div class="stack-tags">
					{#each g.stack as t (t.label)}<Tag>{t.label}</Tag>{/each}
				</div>
			</div>
		{/if}

		{#if glanceItems.length}
			<div class="glance-wrap">
				<GlanceCard items={glanceItems} />
			</div>
		{/if}
	</div>

	<div>
		<MonoLabel class="col-label">Career timeline</MonoLabel>
		{#if data.experiences?.length}
			<Timeline experiences={data.experiences} />
		{:else}
			<EmptyState>No experience entries yet — add some in the Strapi admin.</EmptyState>
		{/if}
	</div>
</section>

{#if data.principles?.length}
	<section class="section section--rule">
		<SectionHead
			title="How I work"
			sub="Principles I keep coming back to. They are not original — they're earned. Each one cost a project to learn."
		/>
		<div class="principles">
			{#each data.principles as p (p.documentId)}
				<div class="principle">
					{#if p.numeral}
						<div class="numeral serif" aria-hidden="true">{p.numeral}</div>
						<span class="sr-only">Principle {p.numeral}</span>
					{/if}
					<h3>{p.title}</h3>
					{#if p.description}<p>{p.description}</p>{/if}
				</div>
			{/each}
		</div>
	</section>
{/if}

{#if data.books?.length}
	<section class="section">
		<SectionHead
			num="R"
			title="Books on the shelf"
			sub="What I'd hand a new senior engineer or interim tech lead. None of these are about the tools — they're about the discipline."
		/>
		<ol class="shelf">
			{#each data.books as b, i (b.documentId)}
				<li class="book">
					<span class="book-num mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
					<div>
						<h3>{b.title}</h3>
						<div class="book-author mono">{b.author}</div>
						{#if b.note}<p class="book-note serif">{b.note}</p>{/if}
					</div>
				</li>
			{/each}
		</ol>
	</section>
{/if}

<section class="contact-band">
	<CtaBand tone="outline" kicker="Get in touch" title="Tell me what you're building.">
		<div class="contact-grid">
			<ContactForm {form} />
			<div class="contact-actions">
				{#if g?.email}
					<p class="contact-alt mono">Prefer email? I read it twice a day.</p>
					<Button href={`mailto:${g.email}`}>{g.email} <span aria-hidden="true">→</span></Button>
				{/if}
				{#if g?.socialLinks?.length}
					<ul class="contact-links mono">
						{#each g.socialLinks as link (link.label)}
							<li>
								<span class="contact-key">{link.label}:</span>
								<a href={link.url} class="link">{link.url.replace(/^https?:\/\//, '')}</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</CtaBand>
</section>

<style>
	.profile-section {
		display: grid;
		grid-template-columns: 1fr 1.6fr;
		gap: 64px;
		padding: 60px 0 80px;
		border-top: 1px solid var(--ink);
	}

	:global(.col-label) {
		margin-bottom: 20px;
	}

	.statement {
		font-size: 22px;
		line-height: 1.45;
		letter-spacing: -0.01em;
		color: var(--ink);
	}

	.bio {
		font-size: 15px;
		line-height: 1.65;
		color: var(--ink-3);
		margin-top: 24px;
	}

	.stack-card {
		margin-top: 32px;
		padding: 24px;
		background: var(--panel);
		border: 1px solid var(--line);
	}

	:global(.stack-label) {
		margin-bottom: 12px;
	}

	.stack-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.glance-wrap {
		margin-top: 24px;
	}

	.principles {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-top: 1px solid var(--ink);
		border-left: 1px solid var(--ink);
	}

	.principle {
		padding: 36px;
		border-right: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
		min-height: 200px;
	}

	.numeral {
		font-size: 24px;
		color: var(--accent);
		margin-bottom: 14px;
		line-height: 1;
	}

	.principle h3 {
		font-size: 26px;
		font-weight: 600;
		letter-spacing: -0.025em;
		line-height: 1.15;
		margin-bottom: 14px;
	}

	.principle p {
		font-size: 15px;
		color: var(--ink-3);
		line-height: 1.6;
	}

	.shelf {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-top: 1px solid var(--ink);
	}

	.book {
		display: grid;
		grid-template-columns: 32px 1fr;
		gap: 16px;
		padding: 24px 32px 24px 0;
		border-bottom: 1px solid var(--line);
	}

	.book:nth-child(odd) {
		border-right: 1px solid var(--line);
	}

	.book:nth-child(even) {
		padding-left: 32px;
	}

	.book-num {
		font-size: 11px;
		color: var(--muted);
	}

	.book h3 {
		font-size: 18px;
		font-weight: 600;
		letter-spacing: -0.015em;
		line-height: 1.25;
	}

	.book-author {
		font-size: 11px;
		color: var(--muted);
		margin-top: 4px;
	}

	.book-note {
		font-size: 15px;
		color: var(--ink-3);
		line-height: 1.55;
		margin-top: 10px;
	}

	.contact-band {
		margin-top: 60px;
	}

	.contact-grid {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 48px;
		margin-top: 32px;
		text-align: left;
	}

	.contact-alt {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.contact-actions {
		display: flex;
		flex-direction: column;
		gap: 20px;
		align-items: flex-end;
	}

	.contact-links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-size: 12px;
		text-align: right;
	}

	.contact-key {
		color: var(--muted);
	}

	@media (max-width: 1000px) {
		.profile-section {
			grid-template-columns: 1fr;
			gap: 48px;
		}
	}

	@media (max-width: 900px) {
		.contact-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 720px) {
		.principles,
		.shelf {
			grid-template-columns: 1fr;
		}

		.book:nth-child(odd) {
			border-right: none;
		}

		.book:nth-child(even) {
			padding-left: 0;
		}

		.contact-actions {
			align-items: flex-start;
		}

		.contact-links {
			text-align: left;
		}
	}
</style>
