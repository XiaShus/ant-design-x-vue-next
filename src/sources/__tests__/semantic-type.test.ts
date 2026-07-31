import { describe, expect, it } from 'vitest';
import type { SourcesSemanticType } from '../index';

describe('SourcesSemanticType export', () => {
  it('exports SourcesSemanticType from package entry', () => {
    const keys = ['root', 'title', 'content'] as const satisfies readonly SourcesSemanticType[];
    expect(keys).toHaveLength(3);
  });
});
