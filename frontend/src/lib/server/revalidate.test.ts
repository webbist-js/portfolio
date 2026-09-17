import { describe, expect, it } from 'vitest';
import { isAuthorized, mapWithLimit, needsSlugs, pathsFor, withDataPaths } from './revalidate';

const slugs = { projects: ['alpha', 'beta'], articles: ['one'], fixPages: ['slow'] };

describe('pathsFor', () => {
	it('purges everything for global', () => {
		expect(pathsFor([{ model: 'global' }], slugs).sort()).toEqual(
			[
				'/',
				'/about',
				'/fixes',
				'/fixes/slow',
				'/services',
				'/work',
				'/work/alpha',
				'/work/beta',
				'/writing',
				'/writing/one'
			].sort()
		);
	});

	it('maps a project to home, index and every detail (next links)', () => {
		expect(pathsFor([{ model: 'project', slug: 'alpha' }], slugs).sort()).toEqual(
			['/', '/work', '/work/alpha', '/work/beta'].sort()
		);
	});

	it('includes a deleted slug no longer in the list', () => {
		expect(pathsFor([{ model: 'project', slug: 'gone' }], slugs)).toContain('/work/gone');
	});

	it('maps articles and topics to writing pages', () => {
		expect(pathsFor([{ model: 'topic' }], slugs).sort()).toEqual(['/', '/writing', '/writing/one']);
		expect(pathsFor([{ model: 'article', slug: 'new' }], slugs)).toContain('/writing/new');
	});

	it('maps fix pages to the hub and every sibling (F/NN codes shift)', () => {
		expect(pathsFor([{ model: 'fix-page', slug: 'slow' }], slugs).sort()).toEqual([
			'/fixes',
			'/fixes/slow'
		]);
		// A slug that is not in the list yet (or has just gone) is still purged,
		// alongside every sibling whose F/NN code the change reorders.
		expect(pathsFor([{ model: 'fix-page', slug: 'gone' }], slugs).sort()).toEqual([
			'/fixes',
			'/fixes/gone',
			'/fixes/slow'
		]);
		// No slug (e.g. delete) → purge every fix page.
		expect(pathsFor([{ model: 'fix-page' }], slugs).sort()).toEqual(['/fixes', '/fixes/slow']);
		expect(pathsFor([{ model: 'fix-category' }], slugs).sort()).toEqual(['/fixes', '/fixes/slow']);
		expect(pathsFor([{ model: 'fixes-hub' }], slugs)).toEqual(['/fixes']);
	});

	it('maps the remaining models', () => {
		expect(pathsFor([{ model: 'homepage' }], slugs)).toEqual(['/']);
		// Services render on every fix page CTA as well as home + services.
		expect(pathsFor([{ model: 'service' }], slugs).sort()).toEqual([
			'/',
			'/fixes',
			'/fixes/slow',
			'/services'
		]);
		for (const model of ['process-phase', 'faq', 'testimonial'])
			expect(pathsFor([{ model }], slugs).sort()).toEqual(['/', '/services']);
		for (const model of ['experience', 'principle', 'book'])
			expect(pathsFor([{ model }], slugs)).toEqual(['/about']);
	});

	it('ignores unknown models and dedupes across entries', () => {
		expect(pathsFor([{ model: 'contact-message' }], slugs)).toEqual([]);
		expect(pathsFor([{ model: 'faq' }, { model: 'service' }], slugs).sort()).toEqual([
			'/',
			'/fixes',
			'/fixes/slow',
			'/services'
		]);
	});
});

describe('needsSlugs', () => {
	it('is true only for models that touch detail pages', () => {
		expect(needsSlugs([{ model: 'faq' }])).toBe(false);
		expect(needsSlugs([{ model: 'fixes-hub' }])).toBe(false);
		expect(needsSlugs([{ model: 'faq' }, { model: 'article' }])).toBe(true);
		expect(needsSlugs([{ model: 'global' }])).toBe(true);
		expect(needsSlugs([{ model: 'service' }])).toBe(true);
		expect(needsSlugs([{ model: 'fix-page' }])).toBe(true);
	});
});

describe('withDataPaths', () => {
	it('adds the SvelteKit data path for each page', () => {
		expect(withDataPaths(['/', '/work/alpha'])).toEqual([
			'/',
			'/__data.json',
			'/work/alpha',
			'/work/alpha/__data.json'
		]);
	});

	it('pairs every page without truncating (the endpoint owns the cap)', () => {
		const many = Array.from({ length: 150 }, (_, i) => `/p/${i}`);
		const all = withDataPaths(many);
		expect(all).toHaveLength(300);
		expect(all.filter((p) => p.endsWith('/__data.json'))).toHaveLength(150);
	});
});

describe('mapWithLimit', () => {
	it('settles every item and never exceeds the limit in flight', async () => {
		let inFlight = 0;
		let peak = 0;
		const results = await mapWithLimit([1, 2, 3, 4, 5, 6, 7], 3, async (n) => {
			peak = Math.max(peak, ++inFlight);
			await new Promise((r) => setTimeout(r, 1));
			inFlight--;
			if (n === 4) throw new Error('boom');
			return n * 2;
		});
		expect(peak).toBeLessThanOrEqual(3);
		expect(results).toHaveLength(7);
		expect(results[0]).toEqual({ status: 'fulfilled', value: 2 });
		expect(results[3].status).toBe('rejected');
	});

	it('handles an empty list', async () => {
		expect(await mapWithLimit([], 4, async () => 1)).toEqual([]);
	});
});

describe('isAuthorized', () => {
	it('accepts only the exact bearer secret', () => {
		expect(isAuthorized('Bearer s3cret', 's3cret')).toBe(true);
		expect(isAuthorized('Bearer s3cre', 's3cret')).toBe(false);
		expect(isAuthorized('s3cret', 's3cret')).toBe(false);
		expect(isAuthorized(null, 's3cret')).toBe(false);
		expect(isAuthorized('Bearer xxxxxx', 's3cret')).toBe(false);
	});
});
