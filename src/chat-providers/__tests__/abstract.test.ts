import { describe, expect, it } from 'vitest';
import { DefaultChatProvider, OpenAIChatProvider } from '../index';

describe('AbstractChatProvider / DefaultChatProvider', () => {
  it('DefaultChatProvider merges params and passes through chunks', () => {
    const provider = new DefaultChatProvider({ params: { model: 'm1' } });
    const input = provider.transformParams({ temperature: 0.2 } as any);
    expect(input).toMatchObject({ model: 'm1', temperature: 0.2 });

    const msg = provider.transformMessage({
      chunk: 'hello' as any,
      chunks: [],
      status: 'updating',
    });
    expect(msg).toBe('hello');
  });

  it('injectGetMessages feeds transformParams history', () => {
    const provider = new OpenAIChatProvider({ params: { model: 'gpt' } });
    provider.injectGetMessages(() => [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'yo' },
    ]);
    const params = provider.transformParams({});
    expect(params.model).toBe('gpt');
    expect(params.messages).toHaveLength(2);
    expect(params.stream).toBe(true);
  });
});
