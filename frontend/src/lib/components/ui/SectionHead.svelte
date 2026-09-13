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
	<div>
		{#if num}<span class="num mono" aria-hidden="true">{num}</span>{/if}
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
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 24px;
		margin-bottom: 40px;
	}

	.num {
		display: block;
		font-size: 11px;
		color: var(--muted);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 14px;
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
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
		}

		.action {
			padding-bottom: 0;
		}
	}
</style>
