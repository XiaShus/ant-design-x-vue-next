import { describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick } from 'vue';
import { clearAllConversations } from '../conversationStore';
import useXChat from '../use-x-chat';

describe('useXChat async defaultMessages / queueRequest / extraInfo', () => {
  it('loads async defaultMessages and exposes isDefaultMessagesRequesting', async () => {
    clearAllConversations();
    let resolveLoad!: (v: { message: string }[]) => void;
    const scope = effectScope();
    const api = scope.run(() =>
      useXChat({
        conversationKey: 'async-1',
        defaultMessages: () =>
          new Promise((resolve) => {
            resolveLoad = resolve;
          }),
      }),
    )!;

    expect(api.isDefaultMessagesRequesting.value).toBe(true);
    resolveLoad([{ message: 'from-server' }]);
    await Promise.resolve();
    await nextTick();
    expect(api.isDefaultMessagesRequesting.value).toBe(false);
    expect(api.messages.value[0]?.message).toBe('from-server');
    scope.stop();
  });

  it('stores extraInfo on onRequest local message', async () => {
    clearAllConversations();
    const scope = effectScope();
    const api = scope.run(() => {
      const agent = {
        request: (_params: any, callbacks: any) => {
          callbacks.onSuccess(['ok']);
        },
      } as any;
      return useXChat({
        agent,
        conversationKey: 'extra-1',
      });
    })!;

    api.onRequest('hello', { extraInfo: { source: 'ui' } });
    await nextTick();
    const local = api.messages.value.find((m) => m.status === 'local');
    expect(local?.extraInfo).toEqual({ source: 'ui' });
    scope.stop();
  });

  it('queueRequest flushes after async defaults', async () => {
    clearAllConversations();
    let resolveLoad!: (v: { message: string }[]) => void;
    const requests: string[] = [];
    const scope = effectScope();
    const api = scope.run(() => {
      const agent = {
        request: (params: any, callbacks: any) => {
          requests.push(String(params.message));
          callbacks.onSuccess([`echo:${params.message}`]);
        },
      } as any;
      return useXChat({
        agent,
        conversationKey: 'q1',
        defaultMessages: () =>
          new Promise((resolve) => {
            resolveLoad = resolve;
          }),
      });
    })!;

    api.queueRequest('q1', 'queued-msg');
    expect(requests).toHaveLength(0);
    resolveLoad([{ message: 'history' }]);
    await Promise.resolve();
    await nextTick();
    expect(requests).toContain('queued-msg');
    scope.stop();
  });
});
