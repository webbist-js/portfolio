<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import '$lib/styles/tokens.css';
	import '$lib/styles/base.css';

	let { children, data } = $props();

	const nav = [
		['/', 'Home'],
		['/work', 'Work'],
		['/services', 'Services'],
		['/writing', 'Writing'],
		['/about', 'About']
	] as const;

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);

	const name = $derived(data.global?.name ?? 'Alex Bennett');
	const year = new Date().getFullYear();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a href="#main" class="skip-link">Skip to content</a>

<div class="shell">
	<div class="status-strip mono">
		<div class="status-left">
			{#if data.global?.available}
				<span class="status-item">
					<span class="dot pulse" aria-hidden="true"></span>
					<strong>Available</strong>
					{#if data.global?.availabilityNote}<span class="dim"
							>— {data.global.availabilityNote}</span
						>{/if}
				</span>
			{/if}
			{#if data.global?.location}<span class="dim">{data.global.location}</span>{/if}
			{#if data.global?.timezone}<span class="dim">{data.global.timezone}</span>{/if}
		</div>
		<div class="status-right">
			{#each data.global?.socialLinks ?? [] as link (link.label)}
				<a href={link.url} class="link dim">{link.label}</a>
			{/each}
		</div>
	</div>

	<header class="site-header">
		<a href={resolve('/')} class="brand">
			<span class="brand-mark" aria-hidden="true">AB</span>
			<span class="brand-name">{name}</span>
			{#if data.global?.jobTitle}<span class="mono brand-role">/ {data.global.jobTitle}</span>{/if}
		</a>
		<nav aria-label="Main">
			{#each nav as [href, label] (href)}
				<a href={resolve(href)} class="nav-link" aria-current={isActive(href) ? 'page' : undefined}>
					<span class="nav-dot" aria-hidden="true"></span>{label}
				</a>
			{/each}
		</nav>
		{#if data.global?.email}
			<a href={`mailto:${data.global.email}`} class="book-btn"
				>Book a call <span aria-hidden="true">↗</span></a
			>
		{/if}
	</header>

	<main id="main" tabindex="-1">
		{@render children()}
	</main>

	<footer class="site-footer">
		<div class="footer-grid">
			<div>
				<div class="footer-brand">
					<span class="footer-mark" aria-hidden="true"></span>
					<span class="footer-name">{name}</span>
				</div>
				{#if data.global?.jobTitle}
					<p class="footer-blurb">
						{data.global.jobTitle.charAt(0).toUpperCase() + data.global.jobTitle.slice(1)}.
						{#if data.global?.available && data.global?.availabilityNote}
							Available for select engagements — {data.global.availabilityNote}.
						{/if}
					</p>
				{/if}
			</div>
			<div>
				<div class="footer-head mono">Site</div>
				<ul class="footer-links">
					{#each nav as [href, label] (href)}
						<li><a href={resolve(href)} class="link">{label}</a></li>
					{/each}
				</ul>
			</div>
			<div>
				<div class="footer-head mono">Elsewhere</div>
				<ul class="footer-links">
					{#each data.global?.socialLinks ?? [] as link (link.label)}
						<li>
							<a href={link.url} class="link">{link.label} <span aria-hidden="true">↗</span></a>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				<div class="footer-head mono">Contact</div>
				{#if data.global?.email}
					<a href={`mailto:${data.global.email}`} class="link accent footer-email"
						>{data.global.email}</a
					>
				{/if}
				<div class="footer-note mono">Replies within 48h</div>
			</div>
		</div>
		<div class="footer-bar mono">
			<span>© {year} {name}</span>
			<span>Hand-built with SvelteKit + Strapi</span>
		</div>
	</footer>
</div>

<style>
	.status-strip {
		display: flex;
		justify-content: space-between;
		gap: 24px;
		padding: 10px 0;
		border-bottom: 1px solid var(--line);
		font-size: 11px;
	}

	.status-left,
	.status-right {
		display: flex;
		gap: 18px;
		align-items: center;
		flex-wrap: wrap;
	}

	.status-item {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.dim {
		color: var(--muted);
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		display: inline-block;
	}

	.site-header {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 32px;
		padding: 20px 0;
		border-bottom: 1px solid var(--line);
		position: sticky;
		top: 0;
		background: var(--paper);
		z-index: 10;
	}

	.brand {
		display: flex;
		align-items: baseline;
		gap: 12px;
	}

	.brand-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border: 2px solid var(--accent);
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		align-self: center;
	}

	.brand-name {
		font-weight: 600;
		font-size: 17px;
		letter-spacing: -0.02em;
	}

	.brand-role {
		font-size: 11px;
		color: var(--muted);
	}

	nav {
		display: flex;
		gap: 28px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.nav-link {
		font-size: 14px;
		font-weight: 500;
		letter-spacing: -0.005em;
		transition: color 200ms;
	}

	.nav-link:hover,
	.nav-link[aria-current='page'] {
		color: var(--accent);
	}

	.nav-dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		background: var(--accent);
		border-radius: 50%;
		margin-right: 8px;
		opacity: 0;
		transition: opacity 200ms;
		vertical-align: middle;
	}

	.nav-link[aria-current='page'] .nav-dot {
		opacity: 1;
	}

	.book-btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 16px;
		background: var(--ink);
		color: var(--dark-text);
		font-size: 13px;
		font-weight: 500;
		transition: background 200ms;
	}

	.book-btn:hover {
		background: var(--accent-solid);
	}

	main {
		min-height: 60vh;
	}

	main:focus {
		outline: none;
	}

	.site-footer {
		padding: 60px 0 28px;
		border-top: 1px solid var(--ink);
		margin-top: 80px;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: 40px;
		padding-bottom: 40px;
	}

	.footer-brand {
		display: flex;
		align-items: baseline;
		gap: 12px;
	}

	.footer-mark {
		width: 14px;
		height: 14px;
		background: var(--accent);
	}

	.footer-name {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.footer-blurb {
		font-size: 14px;
		color: var(--ink-3);
		line-height: 1.55;
		margin-top: 16px;
		max-width: 360px;
	}

	.footer-head {
		font-size: 10px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 14px;
	}

	.footer-links {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.footer-links a {
		font-size: 14px;
	}

	.footer-email {
		font-size: 16px;
		font-weight: 500;
	}

	.footer-note {
		font-size: 11px;
		color: var(--muted);
		margin-top: 8px;
	}

	.footer-bar {
		border-top: 1px solid var(--line);
		padding-top: 20px;
		display: flex;
		justify-content: space-between;
		gap: 16px;
		font-size: 11px;
		color: var(--muted);
	}

	@media (max-width: 900px) {
		.site-header {
			grid-template-columns: 1fr;
			gap: 14px;
		}

		nav {
			justify-content: flex-start;
		}

		.footer-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
