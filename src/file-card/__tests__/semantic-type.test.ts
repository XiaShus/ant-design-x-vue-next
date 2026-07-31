import { describe, expect, it } from 'vitest';
import type { FileCardListSemanticType, FileCardSemanticType } from '../index';

describe('FileCard semantic type exports', () => {
  it('exports FileCardSemanticType from package entry', () => {
    const keys = [
      'root',
      'file',
      'icon',
      'name',
      'description',
    ] as const satisfies readonly FileCardSemanticType[];
    expect(keys).toHaveLength(5);
  });

  it('exports FileCardListSemanticType from package entry', () => {
    const keys = ['root', 'card'] as const satisfies readonly FileCardListSemanticType[];
    expect(keys).toHaveLength(2);
  });
});
