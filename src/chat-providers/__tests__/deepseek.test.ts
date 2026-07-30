import { describe, expect, it } from 'vitest';
import { DeepSeekChatProvider, transformDeepSeekMessage } from '../index';

describe('DeepSeekChatProvider', () => {
  it('opens think block from reasoning_content', () => {
    const msg = transformDeepSeekMessage({
      chunk: {
        data: JSON.stringify({
          choices: [{ delta: { reasoning_content: 'step1' } }],
        }),
      },
      chunks: [],
      status: 'updating',
    });
    expect(String(msg.content)).toContain('<think>');
    expect(String(msg.content)).toContain('step1');
  });

  it('closes think block when content arrives', () => {
    const thinking = transformDeepSeekMessage({
      chunk: {
        data: JSON.stringify({
          choices: [{ delta: { reasoning_content: 'r' } }],
        }),
      },
      chunks: [],
      status: 'updating',
    });

    const answered = transformDeepSeekMessage({
      originMessage: thinking,
      chunk: {
        data: JSON.stringify({
          choices: [{ delta: { content: 'final' } }],
        }),
      },
      chunks: [],
      status: 'updating',
    });

    expect(String(answered.content)).toContain('</think>');
    expect(String(answered.content)).toContain('final');
    expect(String(answered.content)).toContain('status="done"');
  });

  it('asTransformMessage works for useXChat', () => {
    const provider = new DeepSeekChatProvider();
    const transform = provider.asTransformMessage();
    const msg = transform({
      chunk: {
        data: JSON.stringify({
          choices: [{ delta: { content: 'ok' } }],
        }),
      },
      chunks: [],
      status: 'updating',
    });
    expect(msg.content).toBe('ok');
  });
});
