import { describe, expect, it } from 'vitest';
import { barGeometry, keyword, lines, parseDuration } from './duration';

describe('parseDuration', () => {
	it('reads week and month ranges wherever they sit in the string', () => {
		expect(parseDuration('1–3 weeks')).toEqual({ minWeeks: 1, maxWeeks: 3 });
		expect(parseDuration('Diagnosis 1-2 weeks, part-time')).toEqual({ minWeeks: 1, maxWeeks: 2 });
		expect(parseDuration('A few hours a week, 3–6 months')).toEqual({
			minWeeks: 13,
			maxWeeks: 26
		});
	});

	it('returns null when there is no numeric range', () => {
		expect(parseDuration('Part-time, in phases')).toBeNull();
		expect(parseDuration(undefined)).toBeNull();
		expect(parseDuration('6–3 weeks')).toBeNull();
	});
});

describe('barGeometry', () => {
	it('maps the range onto a 0–6 month axis and clamps past the end', () => {
		expect(barGeometry({ minWeeks: 13, maxWeeks: 26 })).toEqual({ left: 50, width: 50 });
		expect(barGeometry({ minWeeks: 20, maxWeeks: 40 }).width).toBeCloseTo(23.08, 1);
	});

	it('keeps a sliver visible for tiny ranges', () => {
		expect(barGeometry({ minWeeks: 1, maxWeeks: 1 }).width).toBe(2);
	});
});

describe('lines and keyword', () => {
	it('splits bullets on newlines and drops blanks', () => {
		expect(lines('a\n\n b \n')).toEqual(['a', 'b']);
		expect(lines(null)).toEqual([]);
	});

	it('takes the last word of the name, lower-cased', () => {
		expect(keyword('Performance & Architecture Rescue')).toBe('rescue');
		expect(keyword('Fractional Technical Lead')).toBe('lead');
	});
});
