import { describe, expect, it } from 'vitest';
import type { PromptsSemanticType } from '../index';

describe('PromptsSemanticType export', () => {
  it('exports PromptsSemanticType from package entry', () => {
    const keys = [
      'root',
      'list',
      'item',
      'itemContent',
      'title',
      'subList',
      'subItem',
    ] as const satisfies readonly PromptsSemanticType[];
    expect(keys).toHaveLength(7);
  });
});
