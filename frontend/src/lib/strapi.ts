import { PUBLIC_STRAPI_URL } from '$env/static/public';

// Thin client for the Strapi 5 REST API. Strapi 5 returns flat entities
// (no attributes wrapper): { data: [...] | {...}, meta: {...} }.

type Fetch = typeof fetch;

export interface Metric {
	value: string;
	label: string;
}

export interface Tag {
	label: string;
}

export interface SocialLink {
	label: string;
	url: string;
}

export interface Stat {
	value: string;
	label: string;
	sublabel?: string;
	context?: string;
}

export interface AgendaItem {
	text: string;
	highlight: boolean;
}

export interface Media {
	url: string;
	alternativeText?: string | null;
	width?: number;
	height?: number;
}

/** shared.seo component from the Strapi SEO plugin. Only the meta fields are
 * rendered; structuredData/canonicalURL stay code-derived on the frontend. */
export interface SeoMeta {
	metaTitle?: string;
	metaDescription?: string;
	metaImage?: Media | null;
}

export type ArticleBlock =
	| {
			__component: 'article.section';
			id: number;
			heading: string;
			body: string;
			kicker?: string | null;
	  }
	| { __component: 'article.quote'; id: number; text: string; attribution?: string | null }
	| {
			__component: 'article.callout';
			id: number;
			body: string;
			label?: string | null;
			variant?: 'info' | 'disclosure' | 'warning' | null;
	  }
	| {
			__component: 'article.code';
			id: number;
			code: string;
			language?: string | null;
			title?: string | null;
	  }
	| { __component: 'article.image'; id: number; image?: Media | null; caption?: string | null };

export interface Pillar {
	title: string;
	body: string;
}

export interface Project {
	documentId: string;
	updatedAt?: string;
	name: string;
	slug: string;
	seo?: SeoMeta | null;
	client?: string;
	stack?: string;
	year?: string;
	role?: string;
	summary?: string;
	featured: boolean;
	challenge?: string;
	approach?: string;
	outcome?: string;
	metrics: Metric[];
	tags: Tag[];
	order: number;
}

export interface Topic {
	documentId: string;
	name: string;
	slug: string;
}

export interface Article {
	documentId: string;
	updatedAt?: string;
	title: string;
	slug: string;
	seo?: SeoMeta | null;
	date: string;
	readingTime?: string;
	excerpt?: string;
	featured: boolean;
	topic?: Topic | null;
	intro?: string;
	blocks: ArticleBlock[];
	externalUrl?: string;
	publisher?: string;
}

export interface FixAspect {
	id: number;
	label: string;
	body: string;
	code?: string | null;
	codeLanguage?: string | null;
	after?: string | null;
}

export interface FixQa {
	id: number;
	question: string;
	answer: string;
}

export type FixBlock =
	| {
			__component: 'article.section';
			id: number;
			heading: string;
			kicker?: string | null;
			body: string;
	  }
	| { __component: 'article.quote'; id: number; text: string; attribution?: string | null }
	| {
			__component: 'article.code';
			id: number;
			code: string;
			language?: string | null;
			title?: string | null;
	  }
	| {
			__component: 'fix.cause';
			id: number;
			title: string;
			likelihood?: number | null;
			aspects: FixAspect[];
	  }
	| { __component: 'fix.faq'; id: number; heading?: string | null; items: FixQa[] }
	| { __component: 'fix.note'; id: number; body: string; tone?: 'plain' | 'warning' | null };

export interface FixCategory {
	documentId: string;
	name: string;
	slug: string;
	description?: string;
	order: number;
}

export interface FixPage {
	documentId: string;
	updatedAt?: string;
	title: string;
	slug: string;
	seo?: SeoMeta | null;
	lede?: string;
	hubSummary?: string;
	category?: FixCategory | null;
	blocks: FixBlock[];
	readingTime?: string;
	symptoms: Tag[];
	reviewed?: string;
	reviewedAgainst?: string;
	ctaKicker?: string;
	ctaText?: string;
	ctaLabel?: string;
	service?: Service | null;
	order: number;
}

export interface FixesHub {
	seo?: SeoMeta | null;
	heading?: string;
	tagline?: string;
	taglineHighlight?: string;
	intro?: string;
	stepsHeading?: string;
	steps: Pillar[];
	stepsNote?: string;
	closingNote?: string;
	ctaText?: string;
	service?: Service | null;
}

export interface Service {
	documentId: string;
	code?: string;
	name: string;
	description?: string;
	bestFor?: string;
	format?: string;
	typical?: string;
	credential?: string;
	order: number;
}

export interface Experience {
	documentId: string;
	years: string;
	role: string;
	organisation?: string;
	description?: string;
	stack: Tag[];
	order: number;
}

export interface ProcessPhase {
	documentId: string;
	step?: string;
	week?: string;
	title: string;
	description?: string;
	order: number;
}

export interface Faq {
	documentId: string;
	question: string;
	answer: string;
	order: number;
}

export interface Principle {
	documentId: string;
	numeral?: string;
	title: string;
	description?: string;
	order: number;
}

export interface Book {
	documentId: string;
	title: string;
	author: string;
	note?: string;
	order: number;
}

export interface Activity {
	documentId: string;
	repo: string;
	message: string;
	branch?: string;
	occurredAt?: string;
	highlight: boolean;
}

export interface Testimonial {
	documentId: string;
	quote: string;
	author: string;
	role?: string;
	company?: string;
	year?: string;
	featured: boolean;
}

export interface Global {
	name: string;
	jobTitle?: string;
	email?: string;
	location?: string;
	timezone?: string;
	available: boolean;
	availabilityNote?: string;
	socialLinks: SocialLink[];
	stack: Tag[];
	newsletterHeading?: string;
	newsletterText?: string;
}

export interface Homepage {
	seo?: SeoMeta | null;
	heroHeadline?: string;
	heroAccent?: string;
	heroHighlight?: string;
	lede?: string;
	footnote?: string;
	stats: Stat[];
	thisWeek: AgendaItem[];
	howIWork: Pillar[];
	featuredProject?: Project | null;
	testimonial?: Testimonial | null;
}

/** Raised when the CMS could not be read at all, as opposed to returning
 * nothing. Callers that render a page must let this propagate: a load that
 * swallows it returns HTTP 200 with missing content, and Vercel then stores
 * that half-empty page in the ISR cache until the next purge or expiry. */
export class StrapiUnavailableError extends Error {
	constructor(message: string, options?: { cause?: unknown }) {
		super(message, options);
		this.name = 'StrapiUnavailableError';
	}
}

/** Strapi answers list endpoints with 25 entries unless asked otherwise, and
 * 100 is its default ceiling. Every listing here is "all of them", including
 * the slug map the ISR purge builds, so ask for the ceiling. */
const ALL = { 'pagination[pageSize]': '100' };

async function strapiFetch<T>(
	fetcher: Fetch,
	path: string,
	params: Record<string, string> = {}
): Promise<T | null> {
	const url = new URL(`/api/${path}`, PUBLIC_STRAPI_URL);
	for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

	let res: Response;
	try {
		res = await fetcher(url.toString());
	} catch (cause) {
		throw new StrapiUnavailableError(`Strapi unreachable: /api/${path}`, { cause });
	}
	if (!res.ok) throw new StrapiUnavailableError(`Strapi returned ${res.status} for /api/${path}`);

	try {
		// A single type with no published entry answers 200 with data: null.
		return (((await res.json()) as { data?: T }).data ?? null) as T | null;
	} catch (cause) {
		throw new StrapiUnavailableError(`Strapi sent an unreadable body for /api/${path}`, { cause });
	}
}

export const getProjects = (f: Fetch) =>
	strapiFetch<Project[]>(f, 'projects', { ...ALL, populate: '*', sort: 'order:asc' });

export const getProject = async (f: Fetch, slug: string) => {
	const data = await strapiFetch<Project[]>(f, 'projects', {
		'filters[slug][$eq]': slug,
		'populate[metrics]': 'true',
		'populate[tags]': 'true',
		'populate[seo][populate]': '*'
	});
	return data?.[0] ?? null;
};

export const getArticles = (f: Fetch) =>
	strapiFetch<Article[]>(f, 'articles', { ...ALL, populate: '*', sort: 'date:desc' });

export const getArticle = async (f: Fetch, slug: string) => {
	const data = await strapiFetch<Article[]>(f, 'articles', {
		'filters[slug][$eq]': slug,
		'populate[topic]': 'true',
		'populate[seo][populate]': '*',
		'populate[blocks][populate]': '*'
	});
	return data?.[0] ?? null;
};

/** Resolves Strapi-relative media URLs against the CMS origin. */
export const mediaUrl = (media?: Media | null) =>
	media?.url ? new URL(media.url, PUBLIC_STRAPI_URL).toString() : null;

export const getTopics = (f: Fetch) =>
	strapiFetch<Topic[]>(f, 'topics', { ...ALL, sort: 'name:asc' });

export const getFixPages = (f: Fetch) =>
	strapiFetch<FixPage[]>(f, 'fix-pages', {
		...ALL,
		'populate[category]': 'true',
		'populate[symptoms]': 'true',
		sort: 'order:asc'
	});

export const getFixPage = async (f: Fetch, slug: string) => {
	const data = await strapiFetch<FixPage[]>(f, 'fix-pages', {
		'filters[slug][$eq]': slug,
		'populate[category]': 'true',
		'populate[service]': 'true',
		'populate[seo][populate]': '*',
		'populate[blocks][populate]': '*'
	});
	return data?.[0] ?? null;
};

export const getFixesHub = (f: Fetch) =>
	strapiFetch<FixesHub>(f, 'fixes-hub', {
		'populate[service]': 'true',
		'populate[steps]': 'true',
		'populate[seo][populate]': '*'
	});

export const getServices = (f: Fetch) =>
	strapiFetch<Service[]>(f, 'services', { ...ALL, sort: 'order:asc' });

export const getExperiences = (f: Fetch) =>
	strapiFetch<Experience[]>(f, 'experiences', { ...ALL, populate: '*', sort: 'order:asc' });

export const getProcessPhases = (f: Fetch) =>
	strapiFetch<ProcessPhase[]>(f, 'process-phases', { ...ALL, sort: 'order:asc' });

export const getFaqs = (f: Fetch) => strapiFetch<Faq[]>(f, 'faqs', { ...ALL, sort: 'order:asc' });

export const getPrinciples = (f: Fetch) =>
	strapiFetch<Principle[]>(f, 'principles', { ...ALL, sort: 'order:asc' });

export const getBooks = (f: Fetch) =>
	strapiFetch<Book[]>(f, 'books', { ...ALL, sort: 'order:asc' });

export const getTestimonials = (f: Fetch) =>
	strapiFetch<Testimonial[]>(f, 'testimonials', { ...ALL });

export const getGlobal = (f: Fetch) => strapiFetch<Global>(f, 'global', { populate: '*' });

export const getHomepage = (f: Fetch) =>
	strapiFetch<Homepage>(f, 'homepage', {
		'populate[seo][populate]': '*',
		'populate[stats]': 'true',
		'populate[thisWeek]': 'true',
		'populate[howIWork]': 'true',
		'populate[featuredProject][populate]': '*',
		'populate[testimonial]': 'true'
	});
