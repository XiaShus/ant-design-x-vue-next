import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Bubble from '../Bubble.vue';
import type { InfoType, TypingOption } from '../interface';

describe('Bubble typing function', () => {
  it('resolves typing from (content, info) => option', async () => {
    vi.useFakeTimers();
    const typingFn = vi.fn((_c: string, info: InfoType): TypingOption | boolean => {
      if (info.key === 'skip') return false;
      return { step: 5, interval: 10 };
    });

    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Bubble, {
              content: 'HelloWorld',
              _key: 'm1',
              typing: typingFn,
            });
        },
      }),
    );

    await nextTick();
    expect(typingFn).toHaveBeenCalled();
    expect(typingFn.mock.calls[0][0]).toBe('HelloWorld');
    expect(typingFn.mock.calls[0][1]).toMatchObject({ key: 'm1' });

    await vi.advanceTimersByTimeAsync(50);
    await nextTick();
    // step 5 → partial typed content shorter than full until timers finish
    const text = wrapper.text();
    expect(text.length).toBeGreaterThan(0);

    await vi.advanceTimersByTimeAsync(500);
    await nextTick();
    expect(wrapper.text()).toContain('HelloWorld');
    wrapper.unmount();
    vi.useRealTimers();
  });

  it('disables typing when function returns false', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Bubble, {
      props: {
        content: 'Instant',
        typing: () => false,
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain('Instant');
    wrapper.unmount();
    vi.useRealTimers();
  });
});
