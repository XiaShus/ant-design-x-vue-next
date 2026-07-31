import { describe, expect, it } from 'vitest';
import type { BubbleProps, BubbleRef } from '../index';

describe('BubbleProps / BubbleRef exports', () => {
  it('exports BubbleProps from package entry', () => {
    const props = {
      content: 'hello',
      placement: 'start',
    } as const satisfies BubbleProps;
    expect(props.content).toBe('hello');
  });

  it('exports BubbleRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
    } satisfies BubbleRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLElement);
  });
});
