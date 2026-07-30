import { describe, expect, it } from 'vitest';
import { effectScope } from 'vue';
import { setConversationMessages } from '../../use-x-chat/conversationStore';
import { useXConversations } from '../index';

describe('useXConversations', () => {
  it('manages conversation list and active key', () => {
    const scope = effectScope();
    const api = scope.run(() =>
      useXConversations({
        defaultConversations: [{ key: 'a', label: 'A' }],
        defaultActiveConversationKey: 'a',
      }),
    )!;

    expect(api.conversations.value).toHaveLength(1);
    expect(api.activeConversationKey.value).toBe('a');

    expect(api.addConversation({ key: 'b', label: 'B' })).toBe(true);
    expect(api.conversations.value).toHaveLength(2);
    expect(api.addConversation({ key: 'b', label: 'B' })).toBe(false);

    api.setActiveConversationKey('b');
    expect(api.activeConversationKey.value).toBe('b');

    setConversationMessages('b', [{ id: 1, message: 'x', status: 'local' }]);
    expect(api.getMessages('b')).toHaveLength(1);

    expect(api.removeConversation('a')).toBe(true);
    expect(api.getConversation('a')).toBeUndefined();

    scope.stop();
  });
});
