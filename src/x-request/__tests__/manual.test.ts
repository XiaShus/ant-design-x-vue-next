import { describe, expect, it, vi } from 'vitest';
import { createManualXRequest, ManualXRequestClass } from '../manual-x-request';
import { OpenAIChatProvider } from '../../chat-providers';

describe('createManualXRequest / AbstractXRequestClass', () => {
  it('requires manual flag for provider', () => {
    const request = new ManualXRequestClass('https://example.com/chat', { manual: false });
    expect(() => new OpenAIChatProvider({ request: request as any })).toThrow(/manual/);
  });

  it('runs provider-owned request via injectRequest + run', async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify({ choices: [{ message: { content: 'hi' } }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const request = createManualXRequest('https://example.com/v1/chat', {
      manual: true,
      fetch: fetchMock as any,
      params: { model: 'm1' },
    });

    const provider = new OpenAIChatProvider({ request, params: { stream: false } });
    const updates: any[] = [];
    let successChunks: any[] = [];

    provider.injectGetMessages(() => []);
    provider.injectRequest({
      onUpdate: (chunk) => {
        updates.push(chunk);
      },
      onSuccess: (chunks) => {
        successChunks = chunks;
      },
      onError: () => {},
    });

    const params = provider.transformParams({ message: 'hello' } as any);
    expect(params.model).toBe('m1');
    expect(params.messages?.[0]?.content).toBe('hello');

    request.run(params);
    await request.asyncHandler;

    expect(fetchMock).toHaveBeenCalled();
    expect(successChunks.length).toBeGreaterThan(0);
  });
});
