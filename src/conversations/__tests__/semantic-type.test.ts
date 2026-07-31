import { describe, expect, it } from 'vitest';
import type { ConversationsSemanticType } from '../index';

describe('ConversationsSemanticType export', () => {
  it('exports ConversationsSemanticType from package entry', () => {
    const keys = [
      'root',
      'creation',
      'group',
      'item',
    ] as const satisfies readonly ConversationsSemanticType[];
    expect(keys).toHaveLength(4);
  });
});
