// Minimal inline markup for CMS text fields: [text](url) links and
// `inline code`. Fix-page prose needs both; full markdown would be overkill.

export type InlineSegment =
	| { type: 'text'; text: string }
	| { type: 'code'; text: string }
	| { type: 'bold'; text: string }
	| { type: 'link'; text: string; url: string };

const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;

export function inlineSegments(text: string): InlineSegment[] {
	const out: InlineSegment[] = [];
	let last = 0;
	for (const m of text.matchAll(TOKEN)) {
		if (m.index > last) out.push({ type: 'text', text: text.slice(last, m.index) });
		if (m[3] !== undefined) out.push({ type: 'code', text: m[3] });
		else if (m[4] !== undefined) out.push({ type: 'bold', text: m[4] });
		else out.push({ type: 'link', text: m[1], url: m[2] });
		last = m.index + m[0].length;
	}
	if (last < text.length) out.push({ type: 'text', text: text.slice(last) });
	return out;
}

/** A block is an unordered list when every line is a `- ` / `* ` item. */
export const isList = (block: string) =>
	/^\s*[-*]\s+/.test(block) &&
	block.split('\n').every((l) => /^\s*[-*]\s+/.test(l) || l.trim() === '');

/** Strips the bullet marker from each line of a list block. */
export const listItems = (block: string) =>
	block
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean)
		.map((l) => l.replace(/^[-*]\s+/, ''));

/** Splits a text field into paragraphs on blank lines. */
export const paragraphs = (text: string) =>
	text
		.split(/\n\n+/)
		.map((p) => p.trim())
		.filter(Boolean);
