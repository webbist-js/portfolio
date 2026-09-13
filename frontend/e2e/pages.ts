// Shared route fixtures for e2e suites. Content markers assume the seeded
// backend (backend/scripts/seed.cjs) is running on :1337.
export const pages = [
	{ path: '/', name: 'home', h1: /digital platforms/i, marker: 'The British Library' },
	{ path: '/work', name: 'work index', h1: /shipped/i, marker: 'The British Library' },
	{
		path: '/work/the-british-library',
		name: 'case study',
		h1: /british library/i,
		marker: 'LibraryOn'
	},
	{
		path: '/services',
		name: 'services',
		h1: /together/i,
		marker: 'Performance & Architecture Rescue'
	},
	{ path: '/writing', name: 'writing index', h1: /./, marker: 'High-Performance Strapi Apps' },
	{
		path: '/writing/strapi-5-next-js-app-router-the-integration-patterns-that-actually-scale',
		name: 'article',
		h1: /integration patterns/i,
		marker: 'typed client'
	},
	{ path: '/about', name: 'about', h1: /./, marker: 'An Elegant Puzzle' }
] as const;
