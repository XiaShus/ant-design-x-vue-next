import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick, ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import Sender, { SenderSwitch } from '../index';

describe('Sender.Switch', () => {
  it('is available as Sender.Switch', () => {
    expect(Sender.Switch).toBeTruthy();
  });

  it('toggles uncontrolled defaultValue and emits change', async () => {
    const onChange = vi.fn();
    const wrapper = mount(SenderSwitch, {
      props: {
        defaultValue: false,
        icon: h(SearchOutlined),
        onChange,
      },
      slots: {
        default: () => 'Deep Search',
      },
    });

    expect(wrapper.classes().some((c) => c.includes('switch-checked'))).toBe(false);
    await wrapper.find('button').trigger('click');
    expect(onChange).toHaveBeenCalledWith(true);
    await nextTick();
    expect(wrapper.classes().some((c) => c.includes('switch-checked'))).toBe(true);
  });

  it('supports controlled value', async () => {
    const value = ref(false);
    const onChange = vi.fn((v: boolean) => {
      value.value = v;
    });
    const wrapper = mount(SenderSwitch, {
      props: {
        value: value.value,
        onChange,
      },
      slots: { default: () => 'Deep Search' },
    });

    await wrapper.find('button').trigger('click');
    expect(onChange).toHaveBeenCalledWith(true);
    await wrapper.setProps({ value: true });
    await nextTick();
    expect(wrapper.classes().some((c) => c.includes('switch-checked'))).toBe(true);
  });

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn();
    const wrapper = mount(SenderSwitch, {
      props: { disabled: true, onChange },
      slots: { default: () => 'Deep Search' },
    });
    await wrapper.find('button').trigger('click');
    expect(onChange).not.toHaveBeenCalled();
  });
});
