import { describe, expect, it } from 'vitest';
import type { SuggestionSemanticType } from '../index';

describe('SuggestionSemanticType export', () => {
  it('exports SuggestionSemanticType from package entry', () => {
    const keys = ['root', 'content', 'popup'] as const satisfies readonly SuggestionSemanticType[];
    expect(keys).toHaveLength(3);
  });
});
