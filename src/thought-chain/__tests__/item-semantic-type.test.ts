import { describe, expect, it } from 'vitest';
import type { ThoughtChainItemSemanticType } from '../index';

describe('ThoughtChainItemSemanticType export', () => {
  it('exports ThoughtChainItemSemanticType from package entry', () => {
    const keys = [
      'root',
      'icon',
      'title',
      'description',
    ] as const satisfies readonly ThoughtChainItemSemanticType[];
    expect(keys).toHaveLength(4);
  });
});
