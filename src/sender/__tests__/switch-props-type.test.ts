import { describe, expect, it } from 'vitest';
import type { SenderSwitchProps, SenderSwitchRef } from '../index';

describe('SenderSwitchProps / SenderSwitchRef exports', () => {
  it('exports SenderSwitchProps from package entry', () => {
    const props = {
      defaultValue: false,
      loading: false,
    } as const satisfies SenderSwitchProps;
    expect(props.defaultValue).toBe(false);
  });

  it('exports SenderSwitchRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
    } satisfies SenderSwitchRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLDivElement);
  });
});
