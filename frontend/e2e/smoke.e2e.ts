import { expect, test } from '@playwright/test';
import { pages } from './pages';

for (const p of pages) {
	test(`${p.name} (${p.path}) renders seeded content`, async ({ page }) => {
		const response = await page.goto(p.path);
		expect(response?.status()).toBe(200);

		// Exactly one h1, matching the page subject.
		const h1 = page.locator('h1');
		await expect(h1).toHaveCount(1);
		await expect(h1).toContainText(p.h1);

		await expect(page.getByText(p.marker).first()).toBeVisible();
	});
}

test('global navigation reaches every section', async ({ page }) => {
	await page.goto('/');
	for (const [label, h1] of [
		['Work', /shipped/i],
		['Services', /together/i],
		['Writing', /./],
		['About', /./]
	] as const) {
		await page.getByRole('navigation').getByRole('link', { name: label }).click();
		await expect(page.locator('h1')).toContainText(h1);
	}
});

test('work index links through to a case study', async ({ page }) => {
	await page.goto('/work');
	await page.getByRole('link', { name: /british library/i }).click();
	await expect(page).toHaveURL(/\/work\/the-british-library/);
	await expect(page.locator('h1')).toContainText(/british library/i);
});

test('404 for unknown case study', async ({ page }) => {
	const response = await page.goto('/work/does-not-exist');
	expect(response?.status()).toBe(404);
});

test('a LinkedIn recommendation expands and cites its source', async ({ page }) => {
	await page.goto('/');

	// Located by its aria-controls target, because the label itself flips to
	// "Hide the full recommendation" once the panel is open.
	const disclose = page.locator('button[aria-controls^="voice-full-"]');
	await expect(disclose).toHaveAttribute('aria-expanded', 'false');
	await expect(disclose).toContainText(/read the full recommendation/i);

	const panelId = await disclose.getAttribute('aria-controls');
	const panel = page.locator(`#${panelId}`);
	await expect(panel).toBeHidden();

	await disclose.click();
	await expect(disclose).toHaveAttribute('aria-expanded', 'true');
	await expect(disclose).toContainText(/hide the full recommendation/i);
	await expect(panel).toBeVisible();
	// The full text is several paragraphs, not one run-on block.
	expect(await panel.locator('p').count()).toBeGreaterThan(1);

	// Reading must not be interrupted by the carousel moving on (WCAG 2.2.2).
	await expect(page.getByRole('button', { name: /play testimonials/i })).toBeVisible();

	await expect(page.getByRole('link', { name: /verified on linkedin/i })).toHaveAttribute(
		'href',
		/linkedin\.com\/in\/.+\/details\/recommendations\//
	);
});
