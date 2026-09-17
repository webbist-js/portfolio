import { describe, expect, it } from 'vitest';
import { inlineSegments, listBlock, paragraphs } from './inline';

describe('listBlock', () => {
	it('reads a bulleted block', () => {
		expect(listBlock('- one\n* two')).toEqual({ ordered: false, items: ['one', 'two'] });
	});

	it('reads a numbered block with either separator', () => {
		expect(listBlock('1. one\n2. two')).toEqual({ ordered: true, items: ['one', 'two'] });
		expect(listBlock('1) one\n2) two')).toEqual({ ordered: true, items: ['one', 'two'] });
	});

	it('keeps numbering that does not start at one or run in order', () => {
		// The markup carries the intent; the browser renders the sequence.
		expect(listBlock('3. three\n4. four')).toEqual({ ordered: true, items: ['three', 'four'] });
	});

	it('ignores blank lines inside a block', () => {
		expect(listBlock('1. one\n\n2. two')?.items).toEqual(['one', 'two']);
	});

	it('returns null for prose, mixed blocks and empty input', () => {
		expect(listBlock('Just a sentence.')).toBeNull();
		expect(listBlock('1. one\nnot an item')).toBeNull();
		expect(listBlock('- one\n1. two')).toBeNull();
		expect(listBlock('   ')).toBeNull();
	});

	it('does not treat a sentence opening with a number as a list', () => {
		expect(listBlock('2024 was the year it broke.')).toBeNull();
	});
});

describe('paragraphs', () => {
	it('splits on blank lines and drops empties', () => {
		expect(paragraphs('one\n\ntwo\n\n\nthree')).toEqual(['one', 'two', 'three']);
	});

	it('keeps single newlines inside a block so lists survive the split', () => {
		expect(paragraphs('1. one\n2. two\n\nAfter.')).toEqual(['1. one\n2. two', 'After.']);
	});
});

describe('inlineSegments', () => {
	it('reads links, code and bold', () => {
		expect(inlineSegments('see [docs](https://x.test) and `npm ci` and **this**')).toEqual([
			{ type: 'text', text: 'see ' },
			{ type: 'link', text: 'docs', url: 'https://x.test' },
			{ type: 'text', text: ' and ' },
			{ type: 'code', text: 'npm ci' },
			{ type: 'text', text: ' and ' },
			{ type: 'bold', text: 'this' }
		]);
	});

	it('passes plain text straight through', () => {
		expect(inlineSegments('nothing to mark up')).toEqual([
			{ type: 'text', text: 'nothing to mark up' }
		]);
	});
});
