import { afterEach, describe, expect, it, vi } from 'vitest';
import XRequest from '../x-request';

function sseResponse(body: string, init?: ResponseInit) {
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' },
    ...init,
  });
}

describe('XRequest enterprise options', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('wires middlewares into fetch', async () => {
    const onRequest = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      return [input, { ...init, headers: { ...(init?.headers as any), 'X-Test': '1' } }] as const;
    });
    const onResponse = vi.fn(async (response: Response) => response);

    const fetchMock = vi.fn(async () => sseResponse('data: {"content":"hi"}\n\n'));

    const request = XRequest({
      baseURL: 'https://example.com/v1/chat',
      model: 'm',
      fetch: fetchMock as any,
      middlewares: { onRequest: onRequest as any, onResponse },
    }).value;

    const chunks: any[] = [];
    await request.create(
      { messages: [{ role: 'user', content: 'hi' }], stream: true },
      {
        onUpdate: (c) => chunks.push(c),
        onSuccess: () => {},
        onError: () => {},
      },
    );

    expect(onRequest).toHaveBeenCalled();
    expect(onResponse).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalled();
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>)['X-Test']).toBe('1');
    expect(chunks.length).toBeGreaterThan(0);
  });

  it('supports abort()', async () => {
    const fetchMock = vi.fn(((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;
        if (signal?.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
          return;
        }
        signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
    }) as typeof fetch);

    const request = XRequest({
      baseURL: 'https://example.com/v1/chat',
      fetch: fetchMock,
    }).value;

    const onError = vi.fn();
    const pending = request.create(
      { messages: [{ role: 'user', content: 'hi' }], stream: true },
      {
        onUpdate: () => {},
        onSuccess: () => {},
        onError,
      },
    );

    await Promise.resolve();
    request.abort();
    await pending;
    expect(onError).toHaveBeenCalled();
    expect(request.isRequesting).toBe(false);
  });

  it('fires TimeoutError when timeout exceeded', async () => {
    const fetchMock = vi.fn(((_input: RequestInfo | URL, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
    }) as typeof fetch);

    const request = XRequest({
      baseURL: 'https://example.com/v1/chat',
      fetch: fetchMock,
      timeout: 30,
    }).value;

    const onError = vi.fn();
    const pending = request.create(
      { messages: [{ role: 'user', content: 'hi' }], stream: true },
      {
        onUpdate: () => {},
        onSuccess: () => {},
        onError,
      },
    );

    await pending;
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls.some((call) => call[0].name === 'TimeoutError')).toBe(true);
    expect(request.isTimeout).toBe(true);
  });
});
