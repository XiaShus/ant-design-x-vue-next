import { describe, expect, it } from 'vitest';
import type { SenderSemanticType } from '../index';

describe('SenderSemanticType export', () => {
  it('exports SenderSemanticType from package entry', () => {
    const keys = [
      'root',
      'prefix',
      'input',
      'suffix',
      'footer',
      'switch',
      'content',
    ] as const satisfies readonly SenderSemanticType[];
    expect(keys).toHaveLength(7);
  });
});
