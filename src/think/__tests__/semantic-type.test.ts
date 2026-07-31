import { describe, expect, it } from 'vitest';
import type { ThinkSemanticType } from '../index';

describe('ThinkSemanticType export', () => {
  it('exports ThinkSemanticType from package entry', () => {
    const keys = ['root', 'status', 'content'] as const satisfies readonly ThinkSemanticType[];
    expect(keys).toHaveLength(3);
  });
});
