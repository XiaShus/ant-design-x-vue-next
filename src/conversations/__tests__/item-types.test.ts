import { describe, expect, it } from 'vitest';
import type {
  Conversation,
  ConversationItemType,
  ConversationsItems,
  DividerItemType,
} from '../index';

describe('Conversations item type exports', () => {
  it('exports Conversation / ConversationItemType from package entry', () => {
    const item = {
      key: 'c1',
      label: 'chat',
    } as const satisfies Conversation;
    const alias: ConversationItemType = item;
    expect(alias.key).toBe('c1');
  });

  it('exports ConversationsItems / DividerItemType from package entry', () => {
    const divider = {
      type: 'divider',
      key: 'd1',
    } as const satisfies DividerItemType;
    const items: ConversationsItems[] = [
      { key: 'c1', label: 'chat' },
      divider,
    ];
    expect(items).toHaveLength(2);
  });
});
