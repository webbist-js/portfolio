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

export type ListBlock = { ordered: boolean; items: string[] };

const BULLET = /^[-*]\s+/;
const NUMBER = /^\d+[.)]\s+/;

/**
 * A block is a list when every non-empty line carries the same marker:
 * `- ` / `* ` for a bulleted list, `1. ` / `1) ` for a numbered one.
 * Returns null for ordinary prose.
 */
export function listBlock(block: string): ListBlock | null {
	const lines = block
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean);
	if (!lines.length) return null;

	for (const marker of [BULLET, NUMBER]) {
		if (lines.every((l) => marker.test(l)))
			return { ordered: marker === NUMBER, items: lines.map((l) => l.replace(marker, '')) };
	}
	return null;
}

/** Splits a text field into paragraphs on blank lines. */
export const paragraphs = (text: string) =>
	text
		.split(/\n\n+/)
		.map((p) => p.trim())
		.filter(Boolean);
