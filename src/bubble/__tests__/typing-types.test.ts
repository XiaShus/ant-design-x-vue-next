import { describe, expect, it } from 'vitest';
import type { BubbleTypingEffect, FooterPlacement, TypingOption } from '../index';

describe('Bubble typing/layout type exports', () => {
  it('exports TypingOption, BubbleTypingEffect, FooterPlacement', () => {
    const effect = 'fade-in' satisfies BubbleTypingEffect;
    const placement = 'inner-end' satisfies FooterPlacement;
    const option = {
      effect,
      step: [1, 3],
      keepPrefix: true,
    } satisfies TypingOption;
    expect(effect).toBe('fade-in');
    expect(placement).toBe('inner-end');
    expect(option.keepPrefix).toBe(true);
  });
});
