import { expect, test } from '@playwright/test';

test('newsletter form rejects an invalid email', async ({ page }) => {
	await page.goto('/writing');
	const input = page.getByLabel('Email address');
	// Bypass native validation to exercise the server-side check.
	await input.evaluate((el: HTMLInputElement) => (el.type = 'text'));
	await input.fill('not-an-email');
	await page.getByRole('button', { name: /subscribe/i }).click();
	await expect(page.getByRole('alert')).toContainText(/valid email/i);
});

test('newsletter form accepts a signup and stores it', async ({ page }) => {
	await page.goto('/writing');
	const email = `e2e-${Date.now()}@example.com`;
	await page.getByLabel('Email address').fill(email);
	await page.getByRole('button', { name: /subscribe/i }).click();
	await expect(page.getByRole('status')).toContainText(/you're in/i);
});

test('contact form requires name, email and message', async ({ page }) => {
	await page.goto('/about');
	// Bypass native required validation to exercise the server-side check.
	await page
		.locator('.contact-form')
		.evaluate((form: HTMLFormElement) => form.setAttribute('novalidate', ''));
	await page.getByRole('button', { name: /send message/i }).click();
	await expect(page.getByRole('alert')).toContainText(/name.*email.*message/i);
});

test('contact form submits successfully', async ({ page }) => {
	await page.goto('/about');
	await page.getByLabel('Name').fill('E2E Test');
	await page.getByLabel('Email', { exact: true }).fill(`e2e-${Date.now()}@example.com`);
	await page.getByLabel('Message').fill('Automated end-to-end submission — safe to delete.');
	await page.getByRole('button', { name: /send message/i }).click();
	await expect(page.getByRole('status')).toContainText(/your message is in/i);
});

test('contact form works without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/about');
	await page.getByLabel('Name').fill('E2E NoJS');
	await page.getByLabel('Email', { exact: true }).fill(`e2e-nojs-${Date.now()}@example.com`);
	await page.getByLabel('Message').fill('Progressive enhancement check — safe to delete.');
	await page.getByRole('button', { name: /send message/i }).click();
	await expect(page.getByRole('status')).toContainText(/your message is in/i);
	await context.close();
});
