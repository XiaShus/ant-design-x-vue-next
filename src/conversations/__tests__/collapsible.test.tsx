import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import Conversations from '../index';

const groupedItems = [
  { key: '1', label: 'Chat 1', group: 'Group A' },
  { key: '2', label: 'Chat 2', group: 'Group B' },
];

describe('Conversations groupable collapsible', () => {
  it('keeps collapsed lists in DOM with v-show hidden (motion ready)', async () => {
    const wrapper = mount(Conversations, {
      props: {
        items: groupedItems,
        groupable: { collapsible: true },
      },
    });
    await nextTick();
    const lists = wrapper.findAll('.ant-conversations-list');
    expect(lists).toHaveLength(2);
    lists.forEach((el) => {
      expect((el.element as HTMLElement).style.display).toBe('none');
    });
    expect(wrapper.findAll('.ant-conversations-group-title-collapsible')).toHaveLength(2);
    wrapper.unmount();
  });

  it('toggles group open on title click', async () => {
    const wrapper = mount(Conversations, {
      props: {
        items: groupedItems,
        groupable: { collapsible: true, defaultExpandedKeys: ['Group A'] },
      },
    });
    await nextTick();
    const lists = wrapper.findAll('.ant-conversations-list');
    expect(lists).toHaveLength(2);
    expect((lists[0].element as HTMLElement).style.display).not.toBe('none');
    expect((lists[1].element as HTMLElement).style.display).toBe('none');
    expect(wrapper.text()).toContain('Chat 1');

    const titles = wrapper.findAll('.ant-conversations-group-title-collapsible');
    await titles[1].trigger('click');
    await nextTick();
    expect((lists[1].element as HTMLElement).style.display).not.toBe('none');
    expect(wrapper.text()).toContain('Chat 2');

    await titles[0].trigger('click');
    await nextTick();
    expect((lists[0].element as HTMLElement).style.display).toBe('none');
    wrapper.unmount();
  });

  it('supports controlled expandedKeys', async () => {
    const onExpand = vi.fn();
    const expandedKeys = ref<string[]>(['Group A']);
    const wrapper = mount(Conversations, {
      props: {
        items: groupedItems,
        groupable: {
          collapsible: true,
          get expandedKeys() {
            return expandedKeys.value;
          },
          onExpand: (keys: string[]) => {
            onExpand(keys);
            expandedKeys.value = keys;
          },
        },
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain('Chat 1');

    const titles = wrapper.findAll('.ant-conversations-group-title-collapsible');
    await titles[0].trigger('click');
    await nextTick();
    expect(onExpand).toHaveBeenCalled();
    expect(onExpand.mock.calls.at(-1)?.[0]).not.toContain('Group A');
    wrapper.unmount();
  });
});
