import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import Bubble from '../Bubble.vue';

describe('Bubble typing.step range', () => {
  it('accepts step as [min, max] and eventually types full content', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Bubble, {
      props: {
        content: 'abcdefghij',
        typing: { step: [2, 4], interval: 10 },
      },
    });

    await vi.advanceTimersByTimeAsync(500);
    await nextTick();
    expect(wrapper.text()).toContain('abcdefghij');
    wrapper.unmount();
    vi.useRealTimers();
  });
});
