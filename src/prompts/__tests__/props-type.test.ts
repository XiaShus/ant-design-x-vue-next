import { describe, expect, it } from 'vitest';
import type { PromptsProps, PromptsRef } from '../index';

describe('PromptsProps / PromptsRef exports', () => {
  it('exports PromptsProps from package entry', () => {
    const props = {
      items: [],
      vertical: false,
    } as const satisfies PromptsProps;
    expect(props.vertical).toBe(false);
  });

  it('exports PromptsRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
    } satisfies PromptsRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLDivElement);
  });
});
