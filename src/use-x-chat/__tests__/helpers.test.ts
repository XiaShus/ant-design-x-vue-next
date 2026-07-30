import { describe, expect, it, vi } from 'vitest';
import useXChat from '../use-x-chat';
import { clearAllConversations } from '../conversationStore';

describe('useXChat message helpers', () => {
  it('setMessage and removeMessage edit the list', () => {
    clearAllConversations();
    const chat = useXChat({
      defaultMessages: [{ message: 'Hello' }, { message: 'World' }],
    });

    expect(chat.setMessage('default_0', { message: 'Hi' })).toBe(true);
    expect(chat.messages.value[0].message).toBe('Hi');
    expect(chat.setMessage('missing', { message: 'x' })).toBe(false);

    expect(chat.removeMessage('default_1')).toBe(true);
    expect(chat.messages.value).toHaveLength(1);
    expect(chat.removeMessage('default_1')).toBe(false);
  });

  it('onReload regenerates an assistant message in place', async () => {
    clearAllConversations();
    let count = 0;
    const agent = {
      request: vi.fn((_params: any, callbacks: any) => {
        count += 1;
        const text = count === 1 ? 'bamboo' : 'bamboo2';
        callbacks.onUpdate?.(text);
        callbacks.onSuccess?.([text]);
      }),
    };

    const chat = useXChat<string>({
      agent: agent as any,
      requestPlaceholder: '...',
      transformMessage: ({ chunk, originMessage, chunks, status }) => {
        if (status === 'success') {
          return (chunks?.[chunks.length - 1] as string) ?? (originMessage as string) ?? '';
        }
        return (chunk as string) ?? (originMessage as string) ?? '';
      },
    });

    chat.onRequest('little');
    await Promise.resolve();

    expect(chat.messages.value.map((m) => m.message)).toEqual(['little', 'bamboo']);
    const assistantId = chat.messages.value[1].id;

    chat.onReload(assistantId);
    await Promise.resolve();

    expect(chat.messages.value).toHaveLength(2);
    expect(chat.messages.value[0].message).toBe('little');
    expect(chat.messages.value[1].message).toBe('bamboo2');
    expect(chat.messages.value[1].id).toBe(assistantId);
    expect(agent.request).toHaveBeenCalledTimes(2);
  });

  it('onReload throws when id is missing', () => {
    clearAllConversations();
    const chat = useXChat({
      agent: { request: vi.fn() } as any,
      defaultMessages: [{ message: 'Hello' }],
    });
    expect(() => chat.onReload('fake-id')).toThrow('message [fake-id] is not found');
  });
});
