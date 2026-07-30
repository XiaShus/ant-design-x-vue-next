import { describe, expect, it, vi } from 'vitest';
import XStream from '../x-stream';

function createReadable(chunks: string[]) {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

describe('XStream', () => {
  it('parses standard sse events', async () => {
    const stream = XStream({
      readableStream: createReadable(['data: hello\n\n', 'data: world\n\n']),
    });

    const chunks: any[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([{ data: 'hello' }, { data: 'world' }]);
  });

  it('skips malformed lines instead of throwing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const stream = XStream({
      readableStream: createReadable(['not-a-kv-line\n\n', 'data: ok\n\n']),
    });

    const chunks: any[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([{ data: 'ok' }]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('supports custom separators', async () => {
    const stream = XStream({
      readableStream: createReadable(['data=one|||data=two|||']),
      streamSeparator: '|||',
      partSeparator: '\n',
      kvSeparator: '=',
    });

    const chunks: any[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([{ data: 'one' }, { data: 'two' }]);
  });
});
