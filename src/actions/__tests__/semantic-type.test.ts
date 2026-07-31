import { describe, expect, it } from 'vitest';
import type { ActionsSemanticType } from '../index';

describe('ActionsSemanticType export', () => {
  it('exports ActionsSemanticType from package entry', () => {
    const keys = ['root', 'item', 'itemDropdown'] as const satisfies readonly ActionsSemanticType[];
    expect(keys).toHaveLength(3);
  });
});
