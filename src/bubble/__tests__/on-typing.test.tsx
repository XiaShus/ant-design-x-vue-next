import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import Bubble from '../Bubble.vue';

describe('Bubble onTyping', () => {
  it('fires onTyping as typed content advances', async () => {
    vi.useFakeTimers();
    const onTyping = vi.fn();
    mount(Bubble, {
      props: {
        content: 'Hello',
        typing: { step: 2, interval: 10 },
        onTyping,
      },
    });

    await vi.advanceTimersByTimeAsync(100);
    await nextTick();

    expect(onTyping.mock.calls.length).toBeGreaterThan(0);
    const [lastRendered, lastFull] = onTyping.mock.calls.at(-1)!;
    expect(lastFull).toBe('Hello');
    expect(typeof lastRendered).toBe('string');
    expect(lastRendered.length).toBeLessThanOrEqual(5);

    await vi.advanceTimersByTimeAsync(200);
    await nextTick();
    const [doneRendered, doneFull] = onTyping.mock.calls.at(-1)!;
    expect(doneRendered).toBe('Hello');
    expect(doneFull).toBe('Hello');
    vi.useRealTimers();
  });
});
