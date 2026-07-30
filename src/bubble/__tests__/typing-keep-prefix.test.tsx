import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import Bubble from '../Bubble.vue';

describe('Bubble typing.keepPrefix', () => {
  it('default keepPrefix resumes from common prefix (streaming)', async () => {
    vi.useFakeTimers();
    const content = ref('Hello');
    const wrapper = mount(Bubble, {
      props: {
        content: content.value,
        typing: { step: 5, interval: 10 },
      },
    });

    // finish initial typing
    await vi.advanceTimersByTimeAsync(200);
    await nextTick();
    expect(wrapper.text()).toContain('Hello');

    content.value = 'Hello World';
    await wrapper.setProps({ content: content.value });
    await nextTick();
    // Should already show common prefix immediately / quickly
    expect(wrapper.text()).toContain('Hello');
    await vi.advanceTimersByTimeAsync(200);
    await nextTick();
    expect(wrapper.text()).toContain('Hello World');
    vi.useRealTimers();
  });

  it('keepPrefix=false restarts typing from the beginning', async () => {
    vi.useFakeTimers();
    const content = ref('Hello');
    const wrapper = mount(Bubble, {
      props: {
        content: content.value,
        typing: { step: 1, interval: 20, keepPrefix: false },
      },
    });

    await vi.advanceTimersByTimeAsync(200);
    await nextTick();
    expect(wrapper.text()).toContain('Hello');

    content.value = 'Hello World';
    await wrapper.setProps({ content: content.value });
    await nextTick();
    // Just after replace, should not yet show full new string
    expect(wrapper.text()).not.toContain('Hello World');
    // First chars only
    await vi.advanceTimersByTimeAsync(20);
    await nextTick();
    const early = wrapper.text();
    expect(early.length).toBeLessThan('Hello World'.length + 5);

    await vi.advanceTimersByTimeAsync(500);
    await nextTick();
    expect(wrapper.text()).toContain('Hello World');
    vi.useRealTimers();
  });
});
