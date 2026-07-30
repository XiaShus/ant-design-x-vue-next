import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import Conversations from '../index';

describe('Conversations onActiveChange', () => {
  it('passes (key, item) when clicking a conversation', async () => {
    const onActiveChange = vi.fn();
    const items = [
      { key: 'a', label: 'Alpha' },
      { key: 'b', label: 'Beta' },
    ];
    const wrapper = mount(Conversations, {
      props: { items, onActiveChange },
    });
    await nextTick();

    const itemNodes = wrapper.findAll('.ant-conversations-item');
    expect(itemNodes.length).toBeGreaterThan(0);
    await itemNodes[1].trigger('click');
    await nextTick();

    expect(onActiveChange).toHaveBeenCalledWith('b', expect.objectContaining({ key: 'b', label: 'Beta' }));
    wrapper.unmount();
  });
});
