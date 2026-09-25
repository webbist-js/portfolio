import { PUBLIC_SITE_URL } from '$env/static/public';
import type { Global } from '$lib/strapi';

/** Site-relative path to absolute URL. Passes absolute URLs (Strapi media) through. */
export const absUrl = (path: string) => new URL(path, PUBLIC_SITE_URL).toString();

/** Stable node ids. Article authors carry the Person @id so the markup on every
 * page resolves to one entity instead of a detached name string. */
export const PERSON_ID = absUrl('/#person');
export const WEBSITE_ID = absUrl('/#website');

/** Fallback share image, also the fallback article image. */
const OG_IMAGE = absUrl('/og.png');

/** schema.org Person, built from the Global single type. Kept context-free so it
 * can be embedded in another node as well as stand alone. */
function personNode(global?: Global | null) {
	return {
		'@type': 'Person',
		'@id': PERSON_ID,
		name: global?.name ?? 'Alex Bennett',
		jobTitle: global?.jobTitle ?? 'Technical lead',
		url: PUBLIC_SITE_URL,
		email: global?.email,
		image: OG_IMAGE,
		address: { '@type': 'PostalAddress', addressCountry: 'GB' },
		sameAs: (global?.socialLinks ?? []).map((l) => l.url).filter((u) => u.startsWith('http')),
		knowsAbout: (global?.stack ?? []).map((t) => t.label)
	};
}

export const personJsonLd = (global?: Global | null) => ({
	'@context': 'https://schema.org',
	...personNode(global)
});

/** Author/publisher reference. Carries a name inline because Google requires one
 * on the article node, plus the @id that ties it to the full Person. */
export function personRef(global?: Global | null) {
	return {
		'@type': 'Person',
		'@id': PERSON_ID,
		name: global?.name ?? 'Alex Bennett',
		url: PUBLIC_SITE_URL
	};
}

export function websiteJsonLd(global?: Global | null) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: global?.name ?? 'Alex Bennett',
		url: PUBLIC_SITE_URL,
		publisher: { '@id': PERSON_ID }
	};
}

/** The about page is a page *about* the Person, not a second Person node. */
export function profilePageJsonLd(global?: Global | null) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ProfilePage',
		url: absUrl('/about'),
		mainEntity: personNode(global)
	};
}

export interface Crumb {
	name: string;
	path: string;
}

/** BreadcrumbList. Without it Google renders the raw URL path under the title. */
export function breadcrumbJsonLd(trail: Crumb[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: trail.map((crumb, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: crumb.name,
			item: absUrl(crumb.path)
		}))
	};
}

/** Article node shared by /writing and /fixes. The image is what makes a result
 * eligible for a thumbnail, so it always falls back to the OG card. */
export function articleJsonLd(opts: {
	type: 'BlogPosting' | 'TechArticle';
	headline: string;
	path: string;
	description?: string | null;
	image?: string | null;
	datePublished?: string | null;
	dateModified?: string | null;
	global?: Global | null;
}) {
	const url = absUrl(opts.path);
	const author = personRef(opts.global);
	const published = opts.datePublished ?? undefined;
	const modified = opts.dateModified ?? published;
	// A hand-set `updated` can predate the publication date; Google reads that as
	// invalid, so the later of the two wins.
	const dateModified = published && modified && modified < published ? published : modified;
	return {
		'@context': 'https://schema.org',
		'@type': opts.type,
		headline: opts.headline,
		description: opts.description ?? undefined,
		url,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		image: opts.image ? absUrl(opts.image) : OG_IMAGE,
		datePublished: published,
		dateModified,
		author,
		publisher: author,
		isPartOf: { '@id': WEBSITE_ID }
	};
}
