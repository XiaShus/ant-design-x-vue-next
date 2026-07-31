import { describe, expect, it } from 'vitest';
import type { BubbleListProps, BubbleListRef } from '../index';

describe('BubbleListProps / BubbleListRef exports', () => {
  it('exports BubbleListProps from package entry', () => {
    const props = {
      items: [],
      autoScroll: true,
    } as const satisfies BubbleListProps;
    expect(props.autoScroll).toBe(true);
  });

  it('exports BubbleListRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
      scrollBoxNativeElement: document.createElement('div'),
      scrollTo: () => {},
    } satisfies BubbleListRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLDivElement);
  });
});
