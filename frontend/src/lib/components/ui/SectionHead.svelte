<script lang="ts">
	let {
		num,
		title,
		titleAccent,
		sub,
		action
	}: {
		num?: string;
		title: string;
		titleAccent?: string;
		sub?: string;
		action?: { label: string; href: string };
	} = $props();
</script>

<div class="section-head">
	{#if num}<span class="num mono" aria-hidden="true">{num}</span>{/if}
	<div>
		<h2>
			{titleAccent ? `${title} ` : title}{#if titleAccent}<span class="accent">{titleAccent}</span
				>{/if}
		</h2>
		{#if sub}<p class="sub">{sub}</p>{/if}
	</div>
	{#if action}
		<!-- Callers pass pre-resolved hrefs; this component cannot know the route id. -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="link accent action" href={action.href}
			>{action.label} <span aria-hidden="true">→</span></a
		>
	{/if}
</div>

<style>
	.section-head {
		display: grid;
		grid-template-columns: 80px 1fr auto;
		gap: 24px;
		align-items: end;
		margin-bottom: 40px;
	}

	.num {
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.05em;
		padding-bottom: 8px;
	}

	h2 {
		font-size: clamp(32px, 4vw, 56px);
		font-weight: 600;
		letter-spacing: -0.035em;
		line-height: 1;
	}

	.sub {
		font-size: 15px;
		color: var(--muted);
		margin-top: 14px;
		max-width: 540px;
		line-height: 1.55;
	}

	.action {
		font-size: 14px;
		font-weight: 500;
		padding-bottom: 8px;
	}

	@media (max-width: 720px) {
		.section-head {
			grid-template-columns: 1fr;
			gap: 10px;
		}
	}
</style>
