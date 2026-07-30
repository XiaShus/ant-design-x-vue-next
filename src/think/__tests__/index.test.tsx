import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import Think from '../Think.vue';

describe('Think', () => {
  it('renders title and content', () => {
    const wrapper = mount(Think, {
      props: { title: 'deep thinking' },
      slots: { default: () => 'thinking body' },
    });

    expect(wrapper.text()).toContain('deep thinking');
    expect(wrapper.text()).toContain('thinking body');
  });

  it('toggles expand on status click', async () => {
    const onExpand = vi.fn();
    const wrapper = mount(Think, {
      props: {
        title: 'thinking',
        defaultExpanded: true,
        onExpand,
      },
      slots: { default: () => 'body' },
    });

    await wrapper.find('.ant-think-status-wrapper').trigger('click');
    expect(onExpand).toHaveBeenCalledWith(false);
  });

  it('supports controlled expanded', async () => {
    const expanded = ref(true);
    const wrapper = mount(Think, {
      props: {
        title: 'thinking',
        expanded: expanded.value,
        onExpand: (next: boolean) => {
          expanded.value = next;
        },
      },
      slots: { default: () => 'body' },
    });

    await wrapper.find('.ant-think-status-wrapper').trigger('click');
    await wrapper.setProps({ expanded: expanded.value });
    await nextTick();
    expect(expanded.value).toBe(false);
  });
});
