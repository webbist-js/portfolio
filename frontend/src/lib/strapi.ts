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

export interface ArticleSection {
	heading: string;
	body: string;
}

export interface Pillar {
	title: string;
	body: string;
}

export interface Project {
	documentId: string;
	name: string;
	slug: string;
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
	title: string;
	slug: string;
	date: string;
	readingTime?: string;
	excerpt?: string;
	featured: boolean;
	topic?: Topic | null;
	intro?: string;
	sections: ArticleSection[];
	pullQuote?: string;
	externalUrl?: string;
	publisher?: string;
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
	capacityLabel?: string;
	capacityOpenPercent?: number;
	socialLinks: SocialLink[];
	stack: Tag[];
	newsletterHeading?: string;
	newsletterText?: string;
}

export interface Homepage {
	heroHeadline?: string;
	heroAccent?: string;
	lede?: string;
	footnote?: string;
	stats: Stat[];
	thisWeek: AgendaItem[];
	howIWork: Pillar[];
	featuredProject?: Project | null;
	testimonial?: Testimonial | null;
}

async function strapiFetch<T>(
	fetcher: Fetch,
	path: string,
	params: Record<string, string> = {}
): Promise<T | null> {
	const url = new URL(`/api/${path}`, PUBLIC_STRAPI_URL);
	for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
	try {
		const res = await fetcher(url.toString());
		if (!res.ok) return null;
		const json = await res.json();
		return json.data as T;
	} catch {
		return null;
	}
}

export const getProjects = (f: Fetch) =>
	strapiFetch<Project[]>(f, 'projects', { populate: '*', sort: 'order:asc' });

export const getProject = async (f: Fetch, slug: string) => {
	const data = await strapiFetch<Project[]>(f, 'projects', {
		'filters[slug][$eq]': slug,
		populate: '*'
	});
	return data?.[0] ?? null;
};

export const getArticles = (f: Fetch) =>
	strapiFetch<Article[]>(f, 'articles', { populate: '*', sort: 'date:desc' });

export const getArticle = async (f: Fetch, slug: string) => {
	const data = await strapiFetch<Article[]>(f, 'articles', {
		'filters[slug][$eq]': slug,
		populate: '*'
	});
	return data?.[0] ?? null;
};

export const getTopics = (f: Fetch) => strapiFetch<Topic[]>(f, 'topics', { sort: 'name:asc' });

export const getServices = (f: Fetch) =>
	strapiFetch<Service[]>(f, 'services', { sort: 'order:asc' });

export const getExperiences = (f: Fetch) =>
	strapiFetch<Experience[]>(f, 'experiences', { populate: '*', sort: 'order:asc' });

export const getProcessPhases = (f: Fetch) =>
	strapiFetch<ProcessPhase[]>(f, 'process-phases', { sort: 'order:asc' });

export const getFaqs = (f: Fetch) => strapiFetch<Faq[]>(f, 'faqs', { sort: 'order:asc' });

export const getPrinciples = (f: Fetch) =>
	strapiFetch<Principle[]>(f, 'principles', { sort: 'order:asc' });

export const getBooks = (f: Fetch) => strapiFetch<Book[]>(f, 'books', { sort: 'order:asc' });

export const getActivities = (f: Fetch) =>
	strapiFetch<Activity[]>(f, 'activities', { sort: 'occurredAt:desc' });

export const getTestimonials = (f: Fetch) => strapiFetch<Testimonial[]>(f, 'testimonials');

export const getGlobal = (f: Fetch) => strapiFetch<Global>(f, 'global', { populate: '*' });

export const getHomepage = (f: Fetch) =>
	strapiFetch<Homepage>(f, 'homepage', {
		'populate[stats]': 'true',
		'populate[thisWeek]': 'true',
		'populate[howIWork]': 'true',
		'populate[featuredProject][populate]': '*',
		'populate[testimonial]': 'true'
	});
