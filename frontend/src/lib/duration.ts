/** Duration bars on the service cards share one axis, 0 to 6 months. */
export const AXIS_WEEKS = 26;

export interface DurationRange {
	minWeeks: number;
	maxWeeks: number;
}

const WEEKS_PER_MONTH = 52 / 12;

/** Reads "1–3 weeks", "8-16 weeks" or "3–6 months" out of the free-text
 * `typical` field, wherever it sits in the string. Anything without a
 * numeric range ("Part-time, in phases") returns null and gets no bar,
 * which is the honest rendering: a bar with no numbers behind it would be
 * decoration pretending to be data. */
export function parseDuration(typical?: string | null): DurationRange | null {
	if (!typical) return null;
	const m = typical.match(/(\d+)\s*[–-]\s*(\d+)\s*(weeks?|months?)/i);
	if (!m) return null;
	const factor = /month/i.test(m[3]) ? WEEKS_PER_MONTH : 1;
	const minWeeks = Number(m[1]) * factor;
	const maxWeeks = Number(m[2]) * factor;
	if (minWeeks > maxWeeks) return null;
	return { minWeeks, maxWeeks };
}

/** Left offset and width of the filled segment, as percentages of the axis,
 * clamped so a range past six months still ends at the edge. */
export function barGeometry({ minWeeks, maxWeeks }: DurationRange) {
	const clamp = (w: number) => Math.max(0, Math.min(AXIS_WEEKS, w));
	const left = (clamp(minWeeks) / AXIS_WEEKS) * 100;
	const right = (clamp(maxWeeks) / AXIS_WEEKS) * 100;
	return { left, width: Math.max(right - left, 2) };
}

/** Bullet list stored as one item per line. Blank lines are ignored. */
export const lines = (text?: string | null) =>
	(text ?? '')
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean);

/** The word a buyer would say: "Discuss rescue", "Discuss lead". */
export const keyword = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.at(-1)
		?.toLowerCase()
		.replace(/[^a-z-]/g, '') ?? '';
