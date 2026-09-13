<script lang="ts">
	import type { Activity } from '$lib/strapi';

	let { activities, limit = 5 }: { activities: Activity[]; limit?: number } = $props();

	const shown = $derived(activities.slice(0, limit));

	function when(iso?: string): string {
		if (!iso) return '';
		const d = new Date(iso);
		const now = new Date();
		const days = Math.floor((now.getTime() - d.getTime()) / 86400000);
		if (days <= 0) {
			return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
		}
		if (days === 1) return 'yesterday';
		return `${days}d ago`;
	}
</script>

<div class="feed">
	<div class="chrome">
		<div class="lights" aria-hidden="true">
			<span class="light red"></span>
			<span class="light amber"></span>
			<span class="light green"></span>
		</div>
		<span class="path mono">~/feed.live</span>
	</div>
	<div class="feed-title mono"><span aria-hidden="true">●</span> Recent activity</div>
	<ul class="mono">
		{#each shown as a, i (a.documentId)}
			<li class:last={i === shown.length - 1}>
				<div class="row-head">
					<span class="repo" class:highlight={a.highlight}
						><span aria-hidden="true">●</span> {a.repo}</span
					>
					<span class="time">{when(a.occurredAt)}</span>
				</div>
				<div class="msg">{a.message}</div>
				{#if a.branch}<div class="branch">{a.branch}</div>{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	.feed {
		padding: 20px;
		background: var(--dark);
		color: var(--dark-text);
	}

	.chrome {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.lights {
		display: flex;
		gap: 5px;
	}

	.light {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.light.red {
		background: #ff5f57;
	}

	.light.amber {
		background: #febc2e;
	}

	.light.green {
		background: #28c840;
	}

	.path {
		font-size: 9px;
		color: var(--dark-muted);
		letter-spacing: 0.1em;
	}

	.feed-title {
		font-size: 10px;
		font-weight: 500;
		color: var(--accent-on-dark);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin: 0 0 14px;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	li {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--dark-line);
	}

	li.last {
		border-bottom: none;
		padding-bottom: 0;
	}

	.row-head {
		display: flex;
		justify-content: space-between;
		gap: 12px;
	}

	.repo {
		font-size: 10px;
		color: var(--dark-muted);
		letter-spacing: 0.05em;
	}

	.repo.highlight {
		color: var(--accent-on-dark);
	}

	.time {
		font-size: 10px;
		color: var(--dark-muted);
	}

	.msg {
		font-size: 11px;
		color: var(--dark-text);
		line-height: 1.4;
	}

	.branch {
		font-size: 9px;
		color: var(--dark-muted);
	}
</style>
