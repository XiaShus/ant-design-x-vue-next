import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';
import Bubble from '../index';

describe('Bubble streaming / footerPlacement', () => {
  it('does not fire onTypingComplete while streaming', async () => {
    const onTypingComplete = vi.fn();
    const wrapper = mount(Bubble, {
      props: {
        content: 'hello',
        streaming: true,
        onTypingComplete,
      },
    });
    await nextTick();
    expect(onTypingComplete).not.toHaveBeenCalled();

    await wrapper.setProps({ streaming: false });
    await nextTick();
    expect(onTypingComplete).toHaveBeenCalled();
  });

  it('renders footer inside content when footerPlacement is inner', () => {
    const wrapper = mount(Bubble, {
      props: {
        content: 'inner footer',
        footerPlacement: 'inner-end',
        footer: () => h('button', { class: 'inner-ft' }, 'F'),
      },
    });
    expect(wrapper.find('.ant-bubble-content-with-footer').exists()).toBe(true);
    expect(wrapper.find('.ant-bubble-content .inner-ft').exists()).toBe(true);
    expect(wrapper.find('.ant-bubble-footer-end').exists()).toBe(true);
  });

  it('aligns outer footer with footerPlacement', () => {
    const wrapper = mount(Bubble, {
      props: {
        content: 'outer',
        footerPlacement: 'outer-end',
        footer: () => h('span', { class: 'outer-ft' }, 'O'),
      },
    });
    expect(wrapper.find('.ant-bubble-content-with-footer').exists()).toBe(false);
    expect(wrapper.find('.ant-bubble-footer-end').exists()).toBe(true);
    expect(wrapper.find('.outer-ft').exists()).toBe(true);
  });
});
