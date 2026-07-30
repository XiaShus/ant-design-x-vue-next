import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';
import Actions from '../index';

describe('Actions semantic classNames / styles', () => {
  it('applies root / item / itemDropdown semantics', async () => {
    const wrapper = mount(Actions, {
      props: {
        items: [
          { key: 'a', icon: h('span', { class: 'icon-a' }), label: 'A' },
          {
            key: 'more',
            icon: h('span', { class: 'icon-more' }),
            children: [{ key: 'sub', label: 'Sub' }],
          },
        ],
        classNames: {
          root: 'sem-root',
          item: 'sem-item',
          itemDropdown: 'sem-dropdown',
        },
        styles: {
          root: { borderWidth: '2px' },
          item: { opacity: '0.9' },
        },
        dropdownProps: { open: true },
      },
      attachTo: document.body,
    });
    await nextTick();

    const root = wrapper.find('.ant-actions');
    expect(root.classes()).toContain('sem-root');
    expect((root.element as HTMLElement).style.borderWidth).toBe('2px');

    const items = wrapper.findAll('.sem-item');
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect((items[0].element as HTMLElement).style.opacity).toBe('0.9');

    // Dropdown overlay gets itemDropdown class via overlayClassName
    await nextTick();
    const dropdown = document.querySelector('.sem-dropdown');
    expect(dropdown).toBeTruthy();

    wrapper.unmount();
  });
});
