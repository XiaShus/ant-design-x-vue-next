import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Conversations from '../index';
import type { ConversationsItems } from '../interface';

describe('Conversations divider items', () => {
  it('renders divider between conversations', async () => {
    const items: ConversationsItems[] = [
      { key: 'a', label: 'Alpha' },
      { type: 'divider' },
      { key: 'b', label: 'Beta' },
    ];
    const wrapper = mount(Conversations, {
      props: { items },
    });
    await nextTick();

    expect(wrapper.findAll('.ant-conversations-divider')).toHaveLength(1);
    expect(wrapper.text()).toContain('Alpha');
    expect(wrapper.text()).toContain('Beta');
    wrapper.unmount();
  });

  it('supports dashed divider and custom key', async () => {
    const items: ConversationsItems[] = [
      { key: 'a', label: 'A' },
      { type: 'divider', key: 'd1', dashed: true },
      { key: 'b', label: 'B' },
    ];
    const wrapper = mount(Conversations, {
      props: { items },
    });
    await nextTick();

    const divider = wrapper.find('.ant-conversations-divider');
    expect(divider.exists()).toBe(true);
    expect(divider.classes().some((c) => c.includes('dashed'))).toBe(true);
    wrapper.unmount();
  });

  it('keeps dividers when groupable is enabled', async () => {
    const items: ConversationsItems[] = [
      { key: '1', label: 'One', group: 'G1' },
      { type: 'divider' },
      { key: '2', label: 'Two', group: 'G2' },
    ];
    const wrapper = mount(Conversations, {
      props: { items, groupable: true },
    });
    await nextTick();

    expect(wrapper.findAll('.ant-conversations-divider')).toHaveLength(1);
    expect(wrapper.text()).toContain('G1');
    expect(wrapper.text()).toContain('G2');
    wrapper.unmount();
  });
});
