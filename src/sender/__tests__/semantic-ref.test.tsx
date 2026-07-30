import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Sender from '../index';
import type { SenderRef } from '../interface';
import type { SlotConfigType } from '../slot-types';

describe('Sender semantic root/content + inputElement', () => {
  it('applies root and content classNames / styles', async () => {
    const wrapper = mount(Sender, {
      props: {
        classNames: { root: 'sem-root', content: 'sem-content' },
        styles: {
          root: { borderWidth: '3px' },
          content: { gap: '12px' },
        },
      },
    });
    await nextTick();

    const root = wrapper.find('.ant-sender');
    expect(root.classes()).toContain('sem-root');
    expect((root.element as HTMLElement).style.borderWidth).toBe('3px');

    const content = wrapper.find('.ant-sender-content');
    expect(content.classes()).toContain('sem-content');
    expect((content.element as HTMLElement).style.gap).toBe('12px');

    wrapper.unmount();
  });

  it('exposes inputElement as textarea in plain mode', async () => {
    const wrapper = mount(Sender, {
      props: { defaultValue: 'hi' },
      attachTo: document.body,
    });
    await nextTick();

    const vm = wrapper.vm as unknown as SenderRef;
    expect(vm.inputElement).toBeTruthy();
    expect(vm.inputElement?.tagName).toBe('TEXTAREA');

    wrapper.unmount();
  });

  it('exposes inputElement in slot mode', async () => {
    const slotConfig: SlotConfigType[] = [{ type: 'text', value: 'Hello' }];
    const wrapper = mount(Sender, {
      props: { slotConfig },
      attachTo: document.body,
    });
    await nextTick();

    const vm = wrapper.vm as unknown as SenderRef;
    expect(vm.inputElement).toBeTruthy();
    expect(vm.inputElement instanceof HTMLElement).toBe(true);

    wrapper.unmount();
  });
});
