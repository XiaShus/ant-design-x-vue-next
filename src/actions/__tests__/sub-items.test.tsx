import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import Actions from '../index';

describe('Actions items[].subItems', () => {
  it('renders dropdown menu when using React-aligned subItems', () => {
    const wrapper = mount(Actions, {
      props: {
        items: [
          {
            key: 'more',
            label: 'More',
            icon: h('span', 'M'),
            subItems: [
              { key: 'a', label: 'Alpha' },
              { key: 'b', label: 'Beta' },
            ],
          },
        ],
      },
    });

    // Nested items use ActionMenu (dropdown), not a plain single action button.
    expect(wrapper.find('.ant-dropdown-trigger').exists()).toBe(true);
    expect(wrapper.find('.ant-actions-list-item-icon').exists()).toBe(true);
  });

  it('prefers children when both children and subItems are set', () => {
    const wrapper = mount(Actions, {
      props: {
        items: [
          {
            key: 'more',
            label: 'More',
            icon: h('span', 'M'),
            children: [{ key: 'from-children', label: 'From children' }],
            subItems: [{ key: 'from-sub', label: 'From subItems' }],
          },
        ],
      },
    });

    expect(wrapper.find('.ant-dropdown-trigger').exists()).toBe(true);
  });
});
