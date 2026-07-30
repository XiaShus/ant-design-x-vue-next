import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';
import Think from '../Think.vue';
import type { ThinkRef } from '../interface';

describe('Think ref', () => {
  it('exposes nativeElement root', async () => {
    const wrapper = mount(Think, {
      props: {
        title: 'Thinking',
        defaultExpanded: true,
      },
      slots: {
        default: () => h('div', 'content'),
      },
    });
    await nextTick();

    const api = wrapper.vm as unknown as ThinkRef;
    const el = api.nativeElement as unknown as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.classList.contains('ant-think')).toBe(true);

    wrapper.unmount();
  });
});
