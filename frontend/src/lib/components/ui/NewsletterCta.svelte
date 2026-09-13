<script lang="ts">
	import { enhance } from '$app/forms';

	export interface NewsletterFormResult {
		subscribed?: boolean;
		error?: string;
		email?: string;
	}

	let {
		heading,
		text,
		form,
		action = '?/subscribe'
	}: {
		heading: string;
		text?: string;
		form?: NewsletterFormResult | null;
		action?: string;
	} = $props();

	let submitting = $state(false);
</script>

<section class="newsletter">
	<div class="grid-bg bg" aria-hidden="true"></div>
	<div class="col">
		<p class="kicker mono">Newsletter</p>
		<h2>{heading}</h2>
		{#if text}<p class="text">{text}</p>{/if}
	</div>
	<div class="col">
		{#if form?.subscribed}
			<p class="thanks mono" role="status">
				<span aria-hidden="true">✓</span> You're in — see you on the first Thursday.
			</p>
		{:else}
			<form
				method="POST"
				{action}
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						submitting = false;
						await update();
					};
				}}
			>
				<!-- Honeypot: hidden from real users, tempting to bots. -->
				<div class="hp" aria-hidden="true">
					<label for="newsletter-company">Company</label>
					<input
						id="newsletter-company"
						type="text"
						name="company"
						tabindex="-1"
						autocomplete="off"
					/>
				</div>
				<div class="controls">
					<label class="sr-only" for="newsletter-email">Email address</label>
					<input
						id="newsletter-email"
						type="email"
						name="email"
						required
						placeholder="you@company.com"
						value={form?.email ?? ''}
					/>
					<button type="submit" disabled={submitting}>
						{submitting ? 'Subscribing…' : 'Subscribe'}
						<span aria-hidden="true">→</span>
					</button>
				</div>
			</form>
			{#if form?.error}
				<p class="error mono" role="alert">{form.error}</p>
			{/if}
		{/if}
	</div>
</section>

<style>
	/* Dark page-ender — same family as the dark CtaBand. */
	.newsletter {
		position: relative;
		overflow: hidden;
		padding: 60px 48px;
		background: var(--dark);
		color: var(--dark-text);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		align-items: center;
	}

	.bg {
		position: absolute;
		inset: 0;
		opacity: 0.4;
	}

	.col {
		position: relative;
	}

	.kicker {
		font-size: 11px;
		color: var(--dark-muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 20px;
	}

	h2 {
		font-size: clamp(26px, 3vw, 36px);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}

	.text {
		font-size: 15px;
		color: var(--dark-soft);
		margin-top: 14px;
		line-height: 1.55;
		max-width: 480px;
	}

	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.controls {
		display: flex;
		border: 1px solid var(--dark-line);
	}

	input {
		flex: 1;
		min-width: 0;
		padding: 18px 20px;
		border: 0;
		font-family: var(--font-mono);
		font-size: 14px;
		background: var(--paper);
		color: var(--ink);
	}

	input::placeholder {
		color: var(--muted);
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 0 28px;
		background: var(--accent-solid);
		color: var(--dark-text);
		border: 0;
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background 200ms,
			color 200ms;
	}

	button:hover {
		background: var(--paper);
		color: var(--ink);
	}

	button:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	/* Status blocks read as light cells on the dark panel. */
	.thanks {
		font-size: 13px;
		color: var(--ink);
		background: var(--paper);
		padding: 18px 22px;
	}

	.error {
		font-size: 12px;
		color: var(--ink);
		margin-top: 10px;
		border-left: 3px solid var(--accent-solid);
		padding: 8px 12px;
		background: var(--paper);
	}

	@media (max-width: 900px) {
		.newsletter {
			grid-template-columns: 1fr;
			padding: 40px 28px;
		}
	}
</style>
