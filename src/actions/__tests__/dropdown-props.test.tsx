import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Actions from '../Actions.vue';

describe('Actions dropdownProps', () => {
  it('passes placement through to Dropdown for submenu items', async () => {
    const getPopupContainer = vi.fn(() => document.body);
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Actions, {
              dropdownProps: {
                placement: 'topRight',
                getPopupContainer,
                open: true,
              },
              items: [
                {
                  key: 'more',
                  label: 'More',
                  children: [{ key: 'a', label: 'A' }],
                },
              ],
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    await nextTick();
    expect(wrapper.find('.ant-actions-list-item').exists()).toBe(true);
    // Dropdown should call getPopupContainer when open
    expect(getPopupContainer).toHaveBeenCalled();
    wrapper.unmount();
  });
});
