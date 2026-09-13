<script lang="ts">
	import type { Service } from '$lib/strapi';

	let { services }: { services: Service[] } = $props();
</script>

<div class="rate-card">
	<table>
		<thead>
			<tr class="mono">
				<th scope="col">code</th>
				<th scope="col">service</th>
				<th scope="col">description</th>
				<th scope="col">format</th>
				<th scope="col">typical</th>
			</tr>
		</thead>
		<tbody>
			{#each services as s (s.documentId)}
				<tr>
					<td class="code mono">{s.code ?? ''}</td>
					<td class="name">{s.name}</td>
					<td class="desc">{s.description ?? ''}</td>
					<td class="format mono">{s.format ?? ''}</td>
					<td class="typical mono">{s.typical ?? ''}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.rate-card {
		border: 1px solid var(--ink);
		background: var(--white);
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	thead tr {
		background: var(--panel);
		border-bottom: 1px solid var(--ink);
	}

	th {
		padding: 14px 24px;
		text-align: left;
		font-size: 10px;
		font-weight: 500;
		color: var(--muted);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	tbody tr {
		border-bottom: 1px solid var(--line);
		transition: background 200ms ease;
	}

	tbody tr:last-child {
		border-bottom: none;
	}

	tbody tr:hover {
		background: var(--panel);
	}

	td {
		padding: 24px;
		vertical-align: top;
	}

	.code {
		font-size: 11px;
		color: var(--accent);
		white-space: nowrap;
	}

	.name {
		font-size: 16px;
		font-weight: 600;
		letter-spacing: -0.01em;
		min-width: 180px;
	}

	.desc {
		font-size: 13px;
		color: var(--ink-3);
		line-height: 1.5;
		min-width: 240px;
	}

	.format {
		font-size: 13px;
		color: var(--ink);
	}

	.typical {
		font-size: 13px;
		color: var(--muted);
	}
</style>
