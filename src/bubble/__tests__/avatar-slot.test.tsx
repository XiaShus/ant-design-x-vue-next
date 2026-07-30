import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Bubble from '../Bubble.vue';
import type { InfoType } from '../interface';

describe('Bubble avatar BubbleSlot', () => {
  it('avatar function receives content and info', async () => {
    const avatar = vi.fn((_c: string, info: InfoType) =>
      h('span', { class: 'avatar-fn' }, `k:${info.key}`),
    );
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Bubble, { content: 'hi', _key: 'a1', avatar });
        },
      }),
    );
    await nextTick();
    expect(avatar).toHaveBeenCalled();
    expect(avatar.mock.calls[0][0]).toBe('hi');
    expect(avatar.mock.calls[0][1]).toMatchObject({ key: 'a1' });
    expect(wrapper.find('.avatar-fn').text()).toBe('k:a1');
    wrapper.unmount();
  });

  it('avatar slot receives content and info', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Bubble,
              { content: 'msg', _key: 's1' },
              {
                avatar: ({ info }: { info: InfoType }) =>
                  h('span', { class: 'avatar-slot' }, String(info.key)),
              },
            );
        },
      }),
    );
    await nextTick();
    expect(wrapper.find('.avatar-slot').text()).toBe('s1');
    wrapper.unmount();
  });
});
