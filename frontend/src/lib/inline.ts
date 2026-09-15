// Minimal inline markup for CMS text fields: [text](url) links and
// `inline code`. Fix-page prose needs both; full markdown would be overkill.

export type InlineSegment =
	| { type: 'text'; text: string }
	| { type: 'code'; text: string }
	| { type: 'link'; text: string; url: string };

const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`/g;

export function inlineSegments(text: string): InlineSegment[] {
	const out: InlineSegment[] = [];
	let last = 0;
	for (const m of text.matchAll(TOKEN)) {
		if (m.index > last) out.push({ type: 'text', text: text.slice(last, m.index) });
		if (m[3] !== undefined) out.push({ type: 'code', text: m[3] });
		else out.push({ type: 'link', text: m[1], url: m[2] });
		last = m.index + m[0].length;
	}
	if (last < text.length) out.push({ type: 'text', text: text.slice(last) });
	return out;
}

/** Splits a text field into paragraphs on blank lines. */
export const paragraphs = (text: string) =>
	text
		.split(/\n\n+/)
		.map((p) => p.trim())
		.filter(Boolean);
