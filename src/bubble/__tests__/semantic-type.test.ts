import { describe, expect, it } from 'vitest';
import type { BubbleSemanticType, ListSemanticType } from '../index';

describe('Bubble semantic type exports', () => {
  it('exports BubbleSemanticType from package entry', () => {
    const keys = [
      'root',
      'body',
      'avatar',
      'content',
      'header',
      'footer',
      'extra',
    ] as const satisfies readonly BubbleSemanticType[];
    expect(keys).toHaveLength(7);
  });

  it('exports ListSemanticType from package entry', () => {
    const keys = [
      'root',
      'body',
      'avatar',
      'content',
      'header',
      'footer',
      'extra',
      'scroll',
      'bubble',
      'system',
      'divider',
    ] as const satisfies readonly ListSemanticType[];
    expect(keys.length).toBeGreaterThanOrEqual(7);
  });
});
