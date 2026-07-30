import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import Actions from '../index';

describe('Actions ItemType.danger', () => {
  it('applies list-danger class on top-level item', () => {
    const wrapper = mount(Actions, {
      props: {
        items: [
          { key: 'delete', label: 'Delete', icon: h('span', 'D'), danger: true },
          { key: 'copy', label: 'Copy', icon: h('span', 'C') },
        ],
      },
    });

    const items = wrapper.findAll('.ant-actions-list-item');
    expect(items[0].classes()).toContain('ant-actions-list-danger');
    expect(items[1].classes()).not.toContain('ant-actions-list-danger');
  });
});
