<script lang="ts">
	import { bookCall, closeBookCall } from '$lib/book-call.svelte';

	let { email }: { email?: string } = $props();

	let dialog: HTMLDialogElement;
	let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');
	let errorMsg = $state('');

	$effect(() => {
		if (bookCall.open && !dialog.open) {
			if (status === 'sent') status = 'idle';
			dialog.showModal();
		} else if (!bookCall.open && dialog.open) {
			dialog.close();
		}
	});

	function onBackdropClick(e: MouseEvent) {
		if (e.target === dialog) closeBookCall();
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		status = 'sending';
		const res = await fetch('/api/book-call', { method: 'POST', body: new FormData(form) }).catch(
			() => null
		);
		if (res?.ok) {
			status = 'sent';
			form.reset();
		} else {
			errorMsg =
				(res && (await res.json().catch(() => null))?.error) ??
				'Something went wrong. Please try again shortly.';
			status = 'error';
		}
	}
</script>

<dialog
	bind:this={dialog}
	aria-labelledby="book-call-title"
	onclose={closeBookCall}
	onclick={onBackdropClick}
>
	<!-- Rendered only while open so the hidden form never pollutes the page's
	     accessibility tree (duplicate Name/Email labels vs the contact form). -->
	{#if bookCall.open}
		<div class="inner">
			<button class="close mono" type="button" onclick={closeBookCall} aria-label="Close">✕</button>

			<p class="kicker mono">Book a call</p>
			<h2 id="book-call-title">A 30-minute intro call.</h2>

			{#if status === 'sent'}
				<p class="sent mono" role="status">
					<span aria-hidden="true">✓</span> Thanks, your request is in. I'll reply with some times within
					48 hours.
				</p>
			{:else}
				<p class="sub">
					Tell me a little about the project and I'll come back with times. No pitch, no deck, just
					whether I can help.
				</p>

				<form onsubmit={submit}>
					{#if status === 'error'}
						<p class="error mono" role="alert">{errorMsg}</p>
					{/if}

					<!-- Honeypot: hidden from real users, tempting to bots. -->
					<div class="hp" aria-hidden="true">
						<label for="bc-company">Company</label>
						<input id="bc-company" type="text" name="company" tabindex="-1" autocomplete="off" />
					</div>

					<div class="field-row">
						<div class="field">
							<label for="bc-name" class="mono">Name</label>
							<input
								id="bc-name"
								type="text"
								name="name"
								required
								maxlength="200"
								autocomplete="name"
							/>
						</div>
						<div class="field">
							<label for="bc-email" class="mono">Email</label>
							<input
								id="bc-email"
								type="email"
								name="email"
								required
								autocomplete="email"
								placeholder="you@company.com"
							/>
						</div>
					</div>

					<div class="field">
						<label for="bc-message" class="mono">What are you building?</label>
						<textarea
							id="bc-message"
							name="message"
							required
							rows="4"
							maxlength="5000"
							placeholder="A sentence or two on the project and where it hurts."></textarea>
					</div>

					<div class="foot">
						<button class="submit" type="submit" disabled={status === 'sending'}>
							{status === 'sending' ? 'Sending…' : 'Request times'}
							<span aria-hidden="true">→</span>
						</button>
						{#if email}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a class="link alt mono" href={`mailto:${email}`}>Prefer email? {email}</a>
						{/if}
					</div>
				</form>
			{/if}
		</div>
	{/if}
</dialog>

<style>
	dialog {
		width: min(560px, calc(100vw - 32px));
		border: 1px solid var(--ink);
		background: var(--paper);
		color: var(--ink);
		padding: 0;
	}

	dialog::backdrop {
		background: rgb(14 14 14 / 55%);
	}

	.inner {
		position: relative;
		padding: 36px;
	}

	.close {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 32px;
		height: 32px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 1px solid var(--line);
		color: var(--muted);
		font-size: 12px;
		cursor: pointer;
		transition:
			color 200ms,
			border-color 200ms;
	}

	.close:hover {
		color: var(--ink);
		border-color: var(--ink);
	}

	.kicker {
		font-size: 10px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-bottom: 12px;
	}

	h2 {
		font-size: clamp(24px, 3vw, 32px);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.1;
	}

	.sub {
		font-size: 14px;
		color: var(--ink-3);
		line-height: 1.6;
		margin: 14px 0 24px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label {
		font-size: 10px;
		color: var(--muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	input,
	textarea {
		padding: 13px 14px;
		border: 1px solid var(--line);
		background: var(--white);
		color: var(--ink);
		font-family: var(--font-mono);
		font-size: 14px;
		resize: vertical;
	}

	input:focus-visible,
	textarea:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: -1px;
	}

	input::placeholder,
	textarea::placeholder {
		color: var(--muted);
	}

	.foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}

	.submit {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 14px 22px;
		background: var(--ink);
		color: var(--dark-text);
		border: 1px solid var(--ink);
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background 200ms,
			border-color 200ms;
	}

	.submit:hover {
		background: var(--accent-solid);
		border-color: var(--accent-solid);
	}

	.submit:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.alt {
		font-size: 11px;
		color: var(--muted);
	}

	.error {
		font-size: 13px;
		border-left: 3px solid var(--accent-solid);
		padding: 10px 14px;
		background: var(--panel);
	}

	.sent {
		font-size: 14px;
		background: var(--panel);
		border: 1px solid var(--line);
		padding: 18px 22px;
		margin-top: 20px;
	}

	@media (max-width: 560px) {
		.inner {
			padding: 28px 20px;
		}

		.field-row {
			grid-template-columns: 1fr;
		}
	}
</style>
