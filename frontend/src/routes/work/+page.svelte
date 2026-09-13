<script lang="ts">
	import { Button, CtaBand, EmptyState, Metric, PageHero, ProjectRow, Seo } from '$lib/components';

	let { data } = $props();

	const projects = $derived(data.projects ?? []);

	const stats = $derived.by(() => {
		if (projects.length < 2) return [];
		const years = projects
			.map((p) => String(p.year ?? '').match(/\b(19|20)\d{2}\b/)?.[0])
			.filter(Boolean)
			.map(Number) as number[];
		const items = [
			{ value: String(projects.length), label: 'engagements' },
			{ value: String(new Set(projects.map((p) => p.client)).size), label: 'clients' }
		];
		if (years.length) {
			const min = Math.min(...years);
			const max = Math.max(...years);
			items.push({
				value: min !== max ? `'${min % 100}–'${max % 100}` : `'${min % 100}`,
				label: 'years active'
			});
		}
		items.push({
			value: String(projects.filter((p) => p.featured).length),
			label: 'featured studies'
		});
		return items;
	});
</script>

<Seo
	title={`Work — ${data.global?.name ?? 'Portfolio'}`}
	description="Selected projects and case studies: enterprise Strapi, headless replatforms, and public-sector delivery."
/>

<PageHero
	kicker="Work · Selected projects"
	lede="Representative engagements from the last few years. Most are abridged for confidentiality — the numbers are real. Open any project to read the full case study."
>
	{#snippet title()}
		Things I've <span class="accent">shipped.</span>
	{/snippet}

	{#if stats.length}
		<div class="work-stats">
			{#each stats as s (s.label)}
				<div class="work-stat">
					<Metric value={s.value} label={s.label} size="md" />
				</div>
			{/each}
		</div>
	{/if}
</PageHero>

{#if projects.length}
	<div class="legend mono" aria-hidden="true">
		<span class="l-num">#</span>
		<span class="l-main">Project / role</span>
		<span class="l-desc">Description</span>
		<span class="l-stack">Stack</span>
		<span class="l-year">Year</span>
		<span class="l-arrow"></span>
	</div>
	<div class="row-list">
		{#each projects as p, i (p.documentId)}
			<ProjectRow project={p} num={String(i + 1).padStart(2, '0')} />
		{/each}
	</div>

	<div class="work-cta">
		<CtaBand
			tone="dark"
			kicker="Have a project?"
			title="Most of my work comes from"
			titleAccent="warm intros."
		>
			{#if data.global?.email}
				<Button href={`mailto:${data.global.email}`}
					>Book a call <span aria-hidden="true">→</span></Button
				>
			{/if}
		</CtaBand>
	</div>
{:else}
	<EmptyState>No projects yet — add some in the Strapi admin.</EmptyState>
{/if}

<style>
	.work-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
		margin-top: 56px;
		border: 1px solid var(--ink);
	}

	.work-stat {
		padding: 24px 28px;
		border-right: 1px solid var(--line);
	}

	.work-stat:last-child {
		border-right: none;
	}

	.legend {
		display: grid;
		grid-template-columns: 40px 1.2fr 1.5fr 200px 50px 24px;
		gap: 24px;
		padding: 14px 0;
		border-top: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.05em;
	}

	.l-year {
		text-align: right;
	}

	.row-list :global(.index-row:first-child) {
		border-top: none;
	}

	.work-cta {
		margin-top: 80px;
	}

	@media (max-width: 900px) {
		.work-stats {
			grid-template-columns: 1fr 1fr;
		}

		.work-stat {
			border-bottom: 1px solid var(--line);
		}

		.legend {
			display: none;
		}
	}
</style>
