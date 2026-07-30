import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import Conversations from '../index';
import { ShortcutKeyCode } from '../../_util/shortcut-keys';

describe('Conversations shortcutKeys', () => {
  it('creation shortcut triggers onClick', async () => {
    const onClick = vi.fn();
    mount(Conversations, {
      props: {
        items: [{ key: '1', label: 'A' }],
        creation: { onClick },
        shortcutKeys: {
          creation: ['Ctrl', ShortcutKeyCode.N],
        },
      },
      attachTo: document.body,
    });
    await nextTick();

    document.dispatchEvent(
      new KeyboardEvent('keydown', { keyCode: ShortcutKeyCode.N, ctrlKey: true, bubbles: true }),
    );
    await nextTick();
    expect(onClick).toHaveBeenCalled();

    document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  });

  it('items number shortcut activates conversation', async () => {
    const onActiveChange = vi.fn();
    const wrapper = mount(Conversations, {
      props: {
        items: [
          { key: 'a', label: 'A' },
          { key: 'b', label: 'B' },
        ],
        onActiveChange,
        shortcutKeys: {
          items: ['Ctrl', 'number'],
        },
      },
      attachTo: document.body,
    });
    await nextTick();

    // Ctrl+2 → index 1 → key 'b'
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        keyCode: ShortcutKeyCode.TWO,
        ctrlKey: true,
        bubbles: true,
      }),
    );
    await nextTick();
    expect(onActiveChange).toHaveBeenCalledWith('b');
    wrapper.unmount();
    document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  });

  it('shows shortcut icons on creation label', async () => {
    const wrapper = mount(Conversations, {
      props: {
        items: [{ key: '1', label: 'A' }],
        creation: {},
        shortcutKeys: {
          creation: ['Ctrl', ShortcutKeyCode.N],
        },
      },
    });
    await nextTick();
    expect(wrapper.find('.ant-conversations-creation-shortcut-key').exists()).toBe(true);
    wrapper.unmount();
  });
});
