import { describe, expect, it } from 'vitest';
import type { ActionsProps, ActionsRef } from '../index';

describe('ActionsProps / ActionsRef exports', () => {
  it('exports ActionsProps from package entry', () => {
    const props = {
      items: [],
      variant: 'borderless',
    } as const satisfies ActionsProps;
    expect(props.variant).toBe('borderless');
  });

  it('exports ActionsRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
    } satisfies ActionsRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLDivElement);
  });
});
