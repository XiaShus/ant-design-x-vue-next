import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import Actions from '../index';

describe('Actions', () => {
  it('ignores click when item is disabled', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Actions, {
      props: {
        items: [
          { key: 'retry', label: 'Retry', icon: h('span', 'R'), disabled: true },
          { key: 'copy', label: 'Copy', icon: h('span', 'C') },
        ],
        onClick,
      },
    });

    const items = wrapper.findAll('.ant-actions-list-item');
    expect(items[0].classes()).toContain('ant-actions-list-item-disabled');
    await items[0].trigger('click');
    expect(onClick).not.toHaveBeenCalled();

    await items[1].trigger('click');
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].key).toBe('copy');
  });
});
