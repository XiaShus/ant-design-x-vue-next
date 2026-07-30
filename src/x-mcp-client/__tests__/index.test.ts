import { describe, expect, it, vi } from 'vitest';
import { XMCPClient } from '../index';

describe('XMCPClient', () => {
  it('rejects invalid baseURL', () => {
    expect(() => XMCPClient('' as any)).toThrow('The baseURL is not valid!');
  });

  it('tools() resolves tool list from JSON response', async () => {
    const tools = [
      {
        name: 'search',
        description: 'Search',
        inputSchema: { type: 'object' as const, properties: { q: { type: 'string' } } },
      },
    ];

    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify(tools), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    const client = XMCPClient('https://mcp.example.com/tools', {
      fetch: fetchMock as any,
      headers: { 'X-Test': '1' },
    });

    const result = await client.tools();
    expect(result).toEqual(tools);
    expect(fetchMock).toHaveBeenCalled();
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>)['X-Test']).toBe('1');
  });

  it('tools() rejects on fetch error', async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error('network');
    });

    const client = XMCPClient('https://mcp.example.com/tools', {
      fetch: fetchMock as any,
    });

    await expect(client.tools()).rejects.toThrow();
  });
});
