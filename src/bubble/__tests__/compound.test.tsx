import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick, ref } from 'vue';
import Bubble from '../index';

describe('Bubble compound APIs', () => {
  it('exposes System / Divider', () => {
    expect(Bubble.System).toBeTruthy();
    expect(Bubble.Divider).toBeTruthy();
  });

  it('Bubble.System renders system class', () => {
    const wrapper = mount(Bubble.System, {
      props: { content: 'Hello, this is a system message' },
    });
    expect(wrapper.classes().some((c) => c.includes('system'))).toBe(true);
    expect(wrapper.text()).toContain('Hello, this is a system message');
  });

  it('Bubble.Divider renders divider content', () => {
    const wrapper = mount(Bubble.Divider, {
      props: {
        content: 'Solid',
        dividerProps: { dashed: true },
      },
    });
    expect(wrapper.classes().some((c) => c.includes('divider'))).toBe(true);
    expect(wrapper.text()).toContain('Solid');
    expect(wrapper.find('.ant-divider').exists()).toBe(true);
  });

  it('editable Bubble shows confirm / cancel and emits', async () => {
    const onEditConfirm = vi.fn();
    const onEditCancel = vi.fn();
    const wrapper = mount(Bubble, {
      props: {
        content: 'editable bubble',
        editable: true,
        onEditConfirm,
        onEditCancel,
      },
    });

    expect(wrapper.find('[contenteditable]').exists()).toBe(true);
    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    await buttons[1].trigger('click');
    expect(onEditCancel).toHaveBeenCalled();
  });

  it('editable option.editing controls edit mode', async () => {
    const editable = ref<boolean | { editing: boolean }>(false);
    const wrapper = mount(Bubble, {
      props: {
        content: 'text',
        editable: editable.value,
      },
    });
    expect(wrapper.find('[contenteditable]').exists()).toBe(false);
    await wrapper.setProps({ editable: { editing: true } });
    await nextTick();
    expect(wrapper.find('[contenteditable]').exists()).toBe(true);
  });
});
