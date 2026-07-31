import { describe, expect, it } from 'vitest';
import type { CodeHighlighterSemanticType } from '../index';

describe('CodeHighlighterSemanticType export', () => {
  it('exports CodeHighlighterSemanticType from package entry', () => {
    const keys = ['root', 'header', 'headerTitle', 'code'] as const satisfies readonly CodeHighlighterSemanticType[];
    expect(keys).toHaveLength(4);
  });
});
