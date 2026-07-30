import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Conversations from '../index';

describe('Conversations semantic classNames / styles', () => {
  it('applies root and group semantics', async () => {
    const wrapper = mount(Conversations, {
      props: {
        items: [
          { key: '1', label: 'One', group: 'Today' },
          { key: '2', label: 'Two', group: 'Today' },
        ],
        groupable: true,
        classNames: {
          root: 'sem-root',
          group: 'sem-group',
          item: 'sem-item',
          creation: 'sem-creation',
        },
        styles: {
          root: { borderWidth: '2px' },
          group: { marginBottom: '8px' },
        },
        creation: { onClick: () => {} },
      },
    });
    await nextTick();

    const root = wrapper.find('ul.ant-conversations');
    expect(root.classes()).toContain('sem-root');
    expect((root.element as HTMLElement).style.borderWidth).toBe('2px');

    const groupLi = wrapper.find('li.sem-group');
    expect(groupLi.exists()).toBe(true);
    expect((groupLi.element as HTMLElement).style.marginBottom).toBe('8px');

    expect(wrapper.find('.sem-item').exists()).toBe(true);
    expect(wrapper.find('.sem-creation').exists()).toBe(true);

    wrapper.unmount();
  });
});
