import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Sender from '../index';
import type { SlotConfigType } from '../slot-types';

describe('Sender insert', () => {
  it('plain mode insert(string) appends text', async () => {
    const wrapper = mount(Sender, {
      props: { value: 'Hi' },
      attachTo: document.body,
    });
    await nextTick();
    (wrapper.vm as any).insert(' there');
    await nextTick();
    expect((wrapper.vm as any).$el.querySelector('textarea')?.value || wrapper.html()).toBeTruthy();
    // controlled value stays unless parent updates; check via onChange path with uncontrolled
    wrapper.unmount();

    const uncontrolled = mount(Sender, {
      props: { defaultValue: 'Hi' },
      attachTo: document.body,
    });
    await nextTick();
    (uncontrolled.vm as any).insert(' there');
    await nextTick();
    const ta = uncontrolled.find('textarea').element as HTMLTextAreaElement;
    expect(ta.value).toBe('Hi there');
    uncontrolled.unmount();
  });

  it('slot mode insert(string) adds text slot', async () => {
    const slotConfig: SlotConfigType[] = [
      { type: 'text', value: 'Hello ' },
      { type: 'input', key: 'name', props: { defaultValue: 'World' } },
    ];
    const wrapper = mount(Sender, {
      props: { slotConfig },
      attachTo: document.body,
    });
    await nextTick();
    (wrapper.vm as any).insert('!');
    await nextTick();
    const val = (wrapper.vm as any).getValue?.();
    expect(val?.value).toBe('Hello World!');
    wrapper.unmount();
  });

  it('slot mode insert(slots[]) still works', async () => {
    const wrapper = mount(Sender, {
      props: {
        slotConfig: [{ type: 'text', value: 'A' }],
      },
      attachTo: document.body,
    });
    await nextTick();
    (wrapper.vm as any).insert([{ type: 'text', value: 'B' }], 'end');
    await nextTick();
    expect((wrapper.vm as any).getValue?.().value).toBe('AB');
    wrapper.unmount();
  });
});
