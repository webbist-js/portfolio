<script lang="ts">
	import { enhance } from '$app/forms';

	export interface ContactFormResult {
		sent?: boolean;
		error?: string;
		values?: { name?: string; email?: string; message?: string };
	}

	let { form, action = '?/contact' }: { form?: ContactFormResult | null; action?: string } =
		$props();

	let submitting = $state(false);
</script>

{#if form?.sent}
	<p class="sent mono" role="status">
		<span aria-hidden="true">✓</span> Thanks, your message is in. I reply within 48 hours.
	</p>
{:else}
	<form
		method="POST"
		{action}
		class="contact-form"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				submitting = false;
				await update();
			};
		}}
	>
		{#if form?.error}
			<p class="error mono" role="alert">{form.error}</p>
		{/if}

		<!-- Honeypot: hidden from real users, tempting to bots. -->
		<div class="hp" aria-hidden="true">
			<label for="contact-company">Company</label>
			<input id="contact-company" type="text" name="company" tabindex="-1" autocomplete="off" />
		</div>

		<div class="field-row">
			<div class="field">
				<label for="contact-name" class="mono">Name</label>
				<input
					id="contact-name"
					type="text"
					name="name"
					required
					maxlength="200"
					autocomplete="name"
					value={form?.values?.name ?? ''}
				/>
			</div>
			<div class="field">
				<label for="contact-email" class="mono">Email</label>
				<input
					id="contact-email"
					type="email"
					name="email"
					required
					autocomplete="email"
					placeholder="you@company.com"
					value={form?.values?.email ?? ''}
				/>
			</div>
		</div>

		<div class="field">
			<label for="contact-message" class="mono">Message</label>
			<textarea
				id="contact-message"
				name="message"
				required
				rows="5"
				maxlength="5000"
				placeholder="What are you building, and where does it hurt?"
				value={form?.values?.message ?? ''}></textarea>
		</div>

		<button type="submit" disabled={submitting}>
			{submitting ? 'Sending…' : 'Send message'}
			<span aria-hidden="true">→</span>
		</button>
	</form>
{/if}

<style>
	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
		text-align: left;
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
		gap: 20px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	/* Rendered on the dark CTA band: dark-muted labels, light input cells. */
	label {
		font-size: 10px;
		color: var(--dark-muted);
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	input,
	textarea {
		padding: 14px 16px;
		border: 1px solid var(--dark-line);
		background: var(--paper);
		color: var(--ink);
		font-family: var(--font-mono);
		font-size: 14px;
		resize: vertical;
	}

	input::placeholder,
	textarea::placeholder {
		color: var(--muted);
	}

	button {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 14px 22px;
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

	/* Status blocks read as light cells on the dark band. */
	.error {
		font-size: 13px;
		color: var(--ink);
		border-left: 3px solid var(--accent-solid);
		padding: 10px 14px;
		background: var(--paper);
	}

	.sent {
		font-size: 14px;
		color: var(--ink);
		background: var(--paper);
		padding: 18px 22px;
		text-align: left;
	}

	@media (max-width: 700px) {
		.field-row {
			grid-template-columns: 1fr;
		}
	}
</style>
