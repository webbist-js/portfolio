import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { pages } from './pages';

for (const p of pages) {
	test(`${p.name} (${p.path}) has no WCAG A/AA violations`, async ({ page }) => {
		await page.goto(p.path);
		const results = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze();

		const summary = results.violations.map((v) => ({
			id: v.id,
			impact: v.impact,
			description: v.description,
			nodes: v.nodes.map((n) => n.target.join(' ')).slice(0, 5)
		}));
		expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
	});
}

test('keyboard: skip link is first focusable and jumps to main content', async ({ page }) => {
	await page.goto('/');
	await page.keyboard.press('Tab');
	const focused = page.locator(':focus');
	await expect(focused).toContainText(/skip/i);
	await focused.press('Enter');
	// After activating the skip link the next Tab lands inside main content,
	// not back at the start of the header nav.
	await page.keyboard.press('Tab');
	const inMain = await page
		.locator(':focus')
		.evaluate((el) => Boolean(el.closest('main')) || el.tagName === 'BODY');
	expect(inMain).toBe(true);
});

test('nav exposes the current page', async ({ page }) => {
	await page.goto('/work');
	const current = page.getByRole('navigation').locator('[aria-current="page"]');
	await expect(current).toHaveCount(1);
	await expect(current).toContainText(/work/i);
});
