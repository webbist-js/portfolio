import { PUBLIC_SITE_URL } from '$env/static/public';
import type { Global } from '$lib/strapi';

/** schema.org Person, built from the Global single type. */
export function personJsonLd(global?: Global | null) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: global?.name ?? 'Alex Bennett',
		jobTitle: global?.jobTitle ?? 'Technical lead',
		url: PUBLIC_SITE_URL,
		email: global?.email,
		address: { '@type': 'PostalAddress', addressCountry: 'GB' },
		sameAs: (global?.socialLinks ?? []).map((l) => l.url).filter((u) => u.startsWith('http')),
		knowsAbout: (global?.stack ?? []).map((t) => t.label)
	};
}

export function websiteJsonLd(global?: Global | null) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: global?.name ?? 'Alex Bennett',
		url: PUBLIC_SITE_URL
	};
}
