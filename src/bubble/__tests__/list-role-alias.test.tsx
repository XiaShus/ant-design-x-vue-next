import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import BubbleList from '../BubbleList.vue';

describe('Bubble.List role alias', () => {
  it('applies React-aligned role map like roles', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(BubbleList, {
              items: [
                { key: '1', role: 'ai', content: 'hello' },
                { key: '2', role: 'user', content: 'hi' },
              ],
              role: {
                ai: { placement: 'start' },
                user: { placement: 'end' },
              },
            });
        },
      }),
    );
    await nextTick();
    await nextTick();

    const bubbles = wrapper.findAll('.ant-bubble');
    expect(bubbles.length).toBeGreaterThanOrEqual(2);
    expect(bubbles[0].classes().some((c) => c.includes('start'))).toBe(true);
    expect(bubbles[1].classes().some((c) => c.includes('end'))).toBe(true);
  });

  it('prefers roles when both role and roles are provided', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(BubbleList, {
              items: [{ key: '1', role: 'ai', content: 'hello' }],
              role: {
                ai: { placement: 'end' },
              },
              roles: {
                ai: { placement: 'start' },
              },
            });
        },
      }),
    );
    await nextTick();
    await nextTick();

    const bubble = wrapper.find('.ant-bubble');
    expect(bubble.classes().some((c) => c.includes('start'))).toBe(true);
    expect(bubble.classes().some((c) => c.includes('end'))).toBe(false);
  });
});
