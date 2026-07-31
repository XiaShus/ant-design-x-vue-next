import { describe, expect, it } from 'vitest';
import type {
  ThoughtChainItemProps,
  ThoughtChainItemRef,
  ThoughtChainItemStatus,
  ThoughtChainItemVariant,
} from '../index';

describe('ThoughtChain.Item props type exports', () => {
  it('exports ThoughtChainItemProps from package entry', () => {
    const props = {
      status: 'loading',
      variant: 'solid',
      blink: false,
      disabled: false,
    } as const satisfies ThoughtChainItemProps;
    expect(props.status).toBe('loading');
  });

  it('exports ThoughtChainItemStatus / Variant / Ref', () => {
    const statuses = [
      'loading',
      'success',
      'error',
      'abort',
    ] as const satisfies readonly ThoughtChainItemStatus[];
    const variants = [
      'solid',
      'outlined',
      'text',
    ] as const satisfies readonly ThoughtChainItemVariant[];
    const ref = { nativeElement: document.createElement('div') } satisfies ThoughtChainItemRef;
    expect(statuses).toHaveLength(4);
    expect(variants).toHaveLength(3);
    expect(ref.nativeElement).toBeInstanceOf(HTMLElement);
  });
});
