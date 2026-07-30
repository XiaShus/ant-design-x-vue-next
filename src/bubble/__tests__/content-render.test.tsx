import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Bubble from '../Bubble.vue';
import BubbleList from '../BubbleList.vue';
import type { InfoType } from '../interface';

describe('Bubble contentRender', () => {
  it('calls contentRender with content and info', async () => {
    const contentRender = vi.fn((content: string, info: InfoType) =>
      h('span', { class: 'cr' }, `${content}:${info.status}:${info.extraInfo?.model}`),
    );
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Bubble, {
              content: 'hello',
              status: 'updating',
              extraInfo: { model: 'gpt' },
              _key: 'k1',
              contentRender,
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(contentRender).toHaveBeenCalled();
    const info = contentRender.mock.calls[0][1] as InfoType;
    expect(info.key).toBe('k1');
    expect(info.status).toBe('updating');
    expect(info.extraInfo).toEqual({ model: 'gpt' });
    expect(wrapper.find('.cr').text()).toBe('hello:updating:gpt');
    wrapper.unmount();
  });

  it('contentRender takes precedence over messageRender', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Bubble, {
              content: 'x',
              messageRender: () => h('span', { class: 'mr' }, 'from-message'),
              contentRender: () => h('span', { class: 'cr' }, 'from-content'),
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(wrapper.find('.cr').exists()).toBe(true);
    expect(wrapper.find('.mr').exists()).toBe(false);
    wrapper.unmount();
  });

  it('keeps messageRender backward compatible', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Bubble, {
              content: 'legacy',
              messageRender: (c: string) => h('span', { class: 'mr' }, `m:${c}`),
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(wrapper.find('.mr').text()).toBe('m:legacy');
    wrapper.unmount();
  });

  it('Bubble.List passes status/extraInfo into contentRender', async () => {
    const contentRender = vi.fn((content: string, info: InfoType) =>
      h('span', { class: 'list-cr' }, `${content}-${info.status}-${info.extraInfo?.id}`),
    );
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(BubbleList, {
              items: [
                {
                  key: 'm1',
                  content: 'hi',
                  status: 'success',
                  extraInfo: { id: 9 },
                  contentRender,
                },
              ],
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    await nextTick();
    expect(contentRender).toHaveBeenCalled();
    const info = contentRender.mock.calls[0][1] as InfoType;
    expect(info.key).toBe('m1');
    expect(info.status).toBe('success');
    expect(info.extraInfo).toEqual({ id: 9 });
    // status/extraInfo should not leak as DOM attributes on bubble root
    const root = wrapper.find('.ant-bubble');
    expect(root.attributes('status')).toBeUndefined();
    expect(root.attributes('extrainfo')).toBeUndefined();
    wrapper.unmount();
  });
});
