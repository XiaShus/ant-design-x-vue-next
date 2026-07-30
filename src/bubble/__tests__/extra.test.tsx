import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Bubble from '../Bubble.vue';
import BubbleList from '../BubbleList.vue';
import type { InfoType } from '../interface';

describe('Bubble extra', () => {
  it('renders extra prop function with info', async () => {
    const extra = vi.fn((_c: string, info: InfoType) =>
      h('span', { class: 'extra-node' }, `ts:${info.key}`),
    );
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Bubble, { content: 'hi', _key: 'm1', extra });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(extra).toHaveBeenCalled();
    expect(wrapper.find('.ant-bubble-extra .extra-node').text()).toBe('ts:m1');
    wrapper.unmount();
  });

  it('slot overrides prop', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Bubble,
              { content: 'hi', extra: () => h('span', { class: 'from-prop' }, 'P') },
              {
                extra: () => h('span', { class: 'from-slot' }, 'S'),
              },
            );
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(wrapper.find('.from-slot').exists()).toBe(true);
    expect(wrapper.find('.from-prop').exists()).toBe(false);
    wrapper.unmount();
  });

  it('hides extra while loading', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Bubble, {
              content: 'hi',
              loading: true,
              extra: () => h('span', { class: 'extra-node' }, 'x'),
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(wrapper.find('.extra-node').exists()).toBe(false);
    wrapper.unmount();
  });

  it('Bubble.List forwards item.extra', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(BubbleList, {
              items: [
                {
                  key: 'a',
                  content: 'msg',
                  extra: () => h('span', { class: 'list-extra' }, 'side'),
                },
              ],
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    await nextTick();
    expect(wrapper.find('.list-extra').text()).toBe('side');
    wrapper.unmount();
  });
});
