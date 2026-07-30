import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import Conversations, { Creation } from '../index';

describe('Conversations.Creation', () => {
  it('is available as Conversations.Creation', () => {
    expect(Conversations.Creation).toBeTruthy();
  });

  it('renders creation button when creation prop is set', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Conversations, {
      props: {
        items: [{ key: '1', label: 'Item 1' }],
        creation: { onClick },
      },
    });
    const btn = wrapper.find('button.ant-conversations-creation');
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toContain('New chat');
    await btn.trigger('click');
    expect(onClick).toHaveBeenCalled();
  });

  it('supports custom label and disabled', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Creation, {
      props: {
        label: 'New Chat',
        disabled: true,
        onClick,
      },
    });
    expect(wrapper.text()).toContain('New Chat');
    await wrapper.trigger('click');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('supports custom icon', () => {
    const wrapper = mount(Creation, {
      props: {
        icon: () => h('span', { class: 'custom-icon' }, '+'),
        label: 'Create',
      },
    });
    expect(wrapper.find('.custom-icon').exists()).toBe(true);
  });
});
