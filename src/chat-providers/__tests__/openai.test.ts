import { describe, expect, it } from 'vitest';
import { OpenAIChatProvider, transformOpenAIMessage, toOpenAIMessages } from '../index';

describe('OpenAIChatProvider', () => {
  it('parses SSE delta chunks cumulatively', () => {
    const first = transformOpenAIMessage({
      chunk: { data: JSON.stringify({ choices: [{ delta: { content: 'Hel' } }] }) },
      chunks: [],
      status: 'updating',
    });
    expect(first.content).toBe('Hel');

    const second = transformOpenAIMessage({
      originMessage: first,
      chunk: { data: JSON.stringify({ choices: [{ delta: { content: 'lo' } }] }) },
      chunks: [],
      status: 'updating',
    });
    expect(second.content).toBe('Hello');
    expect(second.role).toBe('assistant');
  });

  it('ignores [DONE]', () => {
    const msg = transformOpenAIMessage({
      originMessage: { role: 'assistant', content: 'Hi' },
      chunk: { data: '[DONE]' },
      chunks: [],
      status: 'success',
    });
    expect(msg.content).toBe('Hi');
  });

  it('toOpenAIMessages appends user message', () => {
    const list = toOpenAIMessages([{ role: 'assistant', content: 'a' }], 'hi');
    expect(list).toHaveLength(2);
    expect(list[1]).toEqual({ role: 'user', content: 'hi' });
  });

  it('asTransformMessage works for useXChat', () => {
    const provider = new OpenAIChatProvider();
    const transform = provider.asTransformMessage();
    const msg = transform({
      chunk: { data: JSON.stringify({ choices: [{ delta: { content: 'ok' } }] }) },
      chunks: [],
      status: 'updating',
    });
    expect(msg.content).toBe('ok');
  });
});
