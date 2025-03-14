import { describe, it, expect } from 'vitest';
import { mdTextFormat } from './utils';

describe('mdTextFormat', () => {
  it('should preserve code blocks', () => {
    const input = 'Some text ```const x = 1;``` more text';
    const output = mdTextFormat(input);
    expect(output).toBe('Some text ```const x = 1;``` more text');
  });

  it('should format latex with square brackets', () => {
    const input = 'Math: \\[x^2 + y^2 = z^2\\]';
    const output = mdTextFormat(input);
    expect(output).toBe('Math: $$x^2 + y^2 = z^2$$');
  });

  it('should format latex with round brackets', () => {
    const input = 'Inline math: \\(E=mc^2\\)';
    const output = mdTextFormat(input);
    expect(output).toBe('Inline math: $E=mc^2$');
  });

  it('should format quote references', () => {
    const input = '[quote:123456789012345678901234]';
    const output = mdTextFormat(input);
    expect(output).toBe('[123456789012345678901234](QUOTE)');
  });

  it('should format quote references without quote prefix', () => {
    const input = '[123456789012345678901234]';
    const output = mdTextFormat(input);
    expect(output).toBe('[123456789012345678901234](QUOTE)');
  });

  it('should add space between URL and Chinese punctuation', () => {
    const input = 'Link: https://example.com。More text';
    const output = mdTextFormat(input);
    expect(output).toBe('Link: https://example.com 。More text');
  });

  it('should handle multiple patterns in the same text', () => {
    const input = '```code``` \\[latex\\] [quote:123456789012345678901234] https://example.com。';
    const output = mdTextFormat(input);
    expect(output).toBe(
      '```code``` $$latex$$ [123456789012345678901234](QUOTE) https://example.com 。'
    );
  });

  it('should handle empty input', () => {
    const input = '';
    const output = mdTextFormat(input);
    expect(output).toBe('');
  });

  it('should handle text without any special patterns', () => {
    const input = 'Just some normal text';
    const output = mdTextFormat(input);
    expect(output).toBe('Just some normal text');
  });

  it('should handle multiple URLs with Chinese punctuation', () => {
    const input = 'https://example1.com，https://example2.com。';
    const output = mdTextFormat(input);
    expect(output).toBe('https://example1.com ，https://example2.com 。');
  });
});
