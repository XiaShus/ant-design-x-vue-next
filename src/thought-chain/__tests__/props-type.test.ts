import { describe, expect, it } from 'vitest';
import type { ThoughtChainProps, ThoughtChainRef } from '../index';

describe('ThoughtChainProps / ThoughtChainRef exports', () => {
  it('exports ThoughtChainProps from package entry', () => {
    const props = {
      items: [],
      line: true,
    } as const satisfies ThoughtChainProps;
    expect(props.line).toBe(true);
  });

  it('exports ThoughtChainRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
    } satisfies ThoughtChainRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLDivElement);
  });
});
