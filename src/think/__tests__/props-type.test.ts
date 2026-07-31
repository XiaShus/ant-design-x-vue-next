import { describe, expect, it } from 'vitest';
import type { ThinkProps, ThinkRef } from '../index';

describe('ThinkProps / ThinkRef exports', () => {
  it('exports ThinkProps from package entry', () => {
    const props = {
      title: 'Thinking',
      defaultExpanded: true,
    } as const satisfies ThinkProps;
    expect(props.defaultExpanded).toBe(true);
  });

  it('exports ThinkRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
    } satisfies ThinkRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLElement);
  });
});
