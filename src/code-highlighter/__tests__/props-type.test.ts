import { describe, expect, it } from 'vitest';
import type { CodeHighlighterProps, CodeHighlighterRef } from '../index';

describe('CodeHighlighterProps / CodeHighlighterRef exports', () => {
  it('exports CodeHighlighterProps from package entry', () => {
    const props = {
      lang: 'ts',
      children: 'const a = 1;',
    } as const satisfies CodeHighlighterProps;
    expect(props.lang).toBe('ts');
  });

  it('exports CodeHighlighterRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
    } satisfies CodeHighlighterRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLDivElement);
  });
});
