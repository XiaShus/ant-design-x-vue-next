import { describe, expect, it } from 'vitest';
import type { SenderProps, SenderRef } from '../index';

describe('SenderProps / SenderRef exports', () => {
  it('exports SenderProps from package entry', () => {
    const props = {
      defaultValue: 'hi',
      disabled: false,
    } as const satisfies SenderProps;
    expect(props.defaultValue).toBe('hi');
  });

  it('exports SenderRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
      inputElement: null,
      focus: () => {},
      blur: () => {},
      insert: (() => {}) as SenderRef['insert'],
    } satisfies SenderRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLDivElement);
  });
});
