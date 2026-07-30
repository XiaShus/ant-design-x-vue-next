import { describe, expect, it, beforeEach } from 'vitest';
import {
  clearAllConversations,
  getConversationMessages,
  setConversationMessages,
} from '../conversationStore';

describe('conversationStore', () => {
  beforeEach(() => {
    clearAllConversations();
  });

  it('isolates messages by conversation key', () => {
    setConversationMessages('a', [{ id: 1, message: 'a1', status: 'local' }]);
    setConversationMessages('b', [{ id: 2, message: 'b1', status: 'local' }]);

    expect(getConversationMessages('a')).toEqual([{ id: 1, message: 'a1', status: 'local' }]);
    expect(getConversationMessages('b')).toEqual([{ id: 2, message: 'b1', status: 'local' }]);
    expect(getConversationMessages('missing')).toEqual([]);
  });
});
