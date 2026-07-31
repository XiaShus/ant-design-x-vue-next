import { describe, expect, it } from 'vitest';
import type { ThoughtChainLine } from '../index';

describe('ThoughtChainLine export', () => {
  it('exports ThoughtChainLine from package entry', () => {
    const values = [true, false, 'solid', 'dashed', 'dotted'] as const satisfies readonly ThoughtChainLine[];
    expect(values).toHaveLength(5);
  });
});
