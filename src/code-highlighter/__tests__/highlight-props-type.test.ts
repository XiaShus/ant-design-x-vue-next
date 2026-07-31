import { describe, expect, it } from 'vitest';
import type { CodeHighlighterHighlightProps } from '../index';

describe('CodeHighlighterHighlightProps export', () => {
  it('exports CodeHighlighterHighlightProps from package entry', () => {
    const props = {
      className: 'hl',
      showLineNumbers: true,
      startingLineNumber: 10,
    } as const satisfies CodeHighlighterHighlightProps;
    expect(props.showLineNumbers).toBe(true);
    expect(props.startingLineNumber).toBe(10);
  });
});
