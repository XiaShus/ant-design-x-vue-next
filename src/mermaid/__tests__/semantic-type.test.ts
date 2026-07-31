import { describe, expect, it } from 'vitest';
import type { MermaidSemanticType, MermaidType } from '../index';

describe('MermaidSemanticType export', () => {
  it('exports MermaidSemanticType from package entry', () => {
    const keys = ['root', 'header', 'graph', 'code'] as const satisfies readonly MermaidSemanticType[];
    expect(keys).toHaveLength(4);
  });

  it('aliases MermaidType to MermaidSemanticType', () => {
    const keys = ['root', 'header', 'graph', 'code'] as const satisfies readonly MermaidType[];
    expect(keys).toHaveLength(4);
  });
});
