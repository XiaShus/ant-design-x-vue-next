import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import Actions from '../index';

describe('Actions variant', () => {
  it('applies variant-outlined / variant-filled class names', () => {
    const outlined = mount(Actions, {
      props: {
        variant: 'outlined',
        items: [{ key: 'a', label: 'A', icon: h('span', 'A') }],
      },
    });
    expect(outlined.find('.ant-actions-variant-outlined').exists()).toBe(true);
    outlined.unmount();

    const filled = mount(Actions, {
      props: {
        variant: 'filled',
        items: [{ key: 'a', label: 'A', icon: h('span', 'A') }],
      },
    });
    expect(filled.find('.ant-actions-variant-filled').exists()).toBe(true);
    filled.unmount();
  });

  it('maps deprecated border to filled', () => {
    const wrapper = mount(Actions, {
      props: {
        variant: 'border',
        items: [{ key: 'a', label: 'A', icon: h('span', 'A') }],
      },
    });
    expect(wrapper.find('.ant-actions-variant-filled').exists()).toBe(true);
    expect(wrapper.find('.ant-actions-list.border').exists()).toBe(false);
    wrapper.unmount();
  });

  it('defaults to borderless variant class', () => {
    const wrapper = mount(Actions, {
      props: {
        items: [{ key: 'a', label: 'A', icon: h('span', 'A') }],
      },
    });
    expect(wrapper.find('.ant-actions-variant-borderless').exists()).toBe(true);
    wrapper.unmount();
  });
});
