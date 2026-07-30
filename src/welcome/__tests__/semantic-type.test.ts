import { describe, expect, it } from 'vitest';
import type { WelcomeSemanticType } from '../index';

describe('WelcomeSemanticType export', () => {
  it('exports WelcomeSemanticType from package entry', () => {
    const keys = [
      'root',
      'title',
      'description',
      'icon',
      'extra',
    ] as const satisfies readonly WelcomeSemanticType[];
    expect(keys).toHaveLength(5);
  });
});
