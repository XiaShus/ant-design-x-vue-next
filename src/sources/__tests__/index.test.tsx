import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Sources from '../Sources.vue';

describe('Sources', () => {
  it('renders title and items', () => {
    const wrapper = mount(Sources, {
      props: {
        title: '已参考 2 篇资料',
        items: [
          { key: '1', title: 'Ant Design', url: 'https://ant.design' },
          { key: '2', title: 'Vue', url: 'https://vuejs.org' },
        ],
      },
    });

    expect(wrapper.text()).toContain('已参考 2 篇资料');
    expect(wrapper.text()).toContain('Ant Design');
    expect(wrapper.text()).toContain('Vue');
  });

  it('toggles expand on title click', async () => {
    const onExpand = vi.fn();
    const wrapper = mount(Sources, {
      props: {
        title: 'sources',
        defaultExpanded: true,
        onExpand,
        items: [{ key: '1', title: 'A', url: 'https://a.com' }],
      },
    });

    await wrapper.find('.ant-sources-title-wrapper').trigger('click');
    expect(onExpand).toHaveBeenCalledWith(false);
  });

  it('emits click when item clicked', async () => {
    const onClick = vi.fn();
    const item = { key: '1', title: 'A', url: 'https://a.com' };
    const wrapper = mount(Sources, {
      props: {
        title: 'sources',
        items: [item],
        onClick,
      },
    });

    await wrapper.find('.ant-sources-list-item').trigger('click');
    expect(onClick).toHaveBeenCalledWith(item);
  });
});
