import { describe, expect, it } from 'vitest';
import type { ThoughtChainSemanticType } from '../index';

describe('ThoughtChainSemanticType export', () => {
  it('exports ThoughtChainSemanticType from package entry', () => {
    const keys = [
      'root',
      'item',
      'itemHeader',
      'itemIcon',
      'itemContent',
      'itemFooter',
    ] as const satisfies readonly ThoughtChainSemanticType[];
    expect(keys).toHaveLength(6);
  });
});
