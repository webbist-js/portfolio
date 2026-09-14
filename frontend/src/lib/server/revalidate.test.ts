import { describe, expect, it } from 'vitest';
import { isAuthorized, needsSlugs, pathsFor, withDataPaths } from './revalidate';

const slugs = { projects: ['alpha', 'beta'], articles: ['one'] };

describe('pathsFor', () => {
	it('purges everything for global', () => {
		expect(pathsFor([{ model: 'global' }], slugs).sort()).toEqual(
			[
				'/',
				'/about',
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

	it('maps the remaining models', () => {
		expect(pathsFor([{ model: 'homepage' }], slugs)).toEqual(['/']);
		for (const model of ['service', 'process-phase', 'faq', 'testimonial'])
			expect(pathsFor([{ model }], slugs).sort()).toEqual(['/', '/services']);
		for (const model of ['experience', 'principle', 'book'])
			expect(pathsFor([{ model }], slugs)).toEqual(['/about']);
		expect(pathsFor([{ model: 'activity' }], slugs).sort()).toEqual(['/', '/about']);
	});

	it('ignores unknown models and dedupes across entries', () => {
		expect(pathsFor([{ model: 'contact-message' }], slugs)).toEqual([]);
		expect(pathsFor([{ model: 'faq' }, { model: 'service' }], slugs).sort()).toEqual([
			'/',
			'/services'
		]);
	});
});

describe('needsSlugs', () => {
	it('is true only for models that touch detail pages', () => {
		expect(needsSlugs([{ model: 'faq' }])).toBe(false);
		expect(needsSlugs([{ model: 'faq' }, { model: 'article' }])).toBe(true);
		expect(needsSlugs([{ model: 'global' }])).toBe(true);
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

	it('caps the fan-out', () => {
		const many = Array.from({ length: 150 }, (_, i) => `/p/${i}`);
		const capped = withDataPaths(many, 200);
		expect(capped).toHaveLength(200);
		expect(capped.filter((p) => p.endsWith('/__data.json'))).toHaveLength(100);
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
