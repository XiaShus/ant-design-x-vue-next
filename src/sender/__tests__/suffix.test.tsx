import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Sender from '../Sender.vue';

describe('Sender suffix', () => {
  it('renders custom suffix render prop', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Sender, {
              suffix: () => h('button', { class: 'custom-suffix-btn' }, 'Go'),
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(wrapper.find('.custom-suffix-btn').exists()).toBe(true);
    expect(wrapper.find('.custom-suffix-btn').text()).toBe('Go');
    wrapper.unmount();
  });

  it('suffix={false} hides action area', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Sender, { suffix: false });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(wrapper.find('.ant-sender-actions-list').exists()).toBe(false);
    wrapper.unmount();
  });

  it('suffix prop takes precedence over actions', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Sender, {
              actions: () => h('button', { class: 'from-actions' }, 'A'),
              suffix: () => h('button', { class: 'from-suffix' }, 'S'),
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(wrapper.find('.from-suffix').exists()).toBe(true);
    expect(wrapper.find('.from-actions').exists()).toBe(false);
    wrapper.unmount();
  });

  it('keeps actions backward compatible', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Sender, {
              actions: () => h('button', { class: 'legacy-actions' }, 'Legacy'),
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(wrapper.find('.legacy-actions').exists()).toBe(true);
    wrapper.unmount();
  });

  it('applies classNames.suffix', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(Sender, { classNames: { suffix: 'my-suffix' } });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(wrapper.find('.ant-sender-actions-list.my-suffix').exists()).toBe(true);
    wrapper.unmount();
  });
});
