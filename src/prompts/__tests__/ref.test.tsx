import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Prompts from '../Prompts.vue';
import type { PromptsRef } from '../interface';

describe('Prompts ref', () => {
  it('exposes nativeElement root', async () => {
    const wrapper = mount(Prompts, {
      props: {
        items: [{ key: '1', label: 'Hello' }],
      },
    });
    await nextTick();

    const api = wrapper.vm as unknown as PromptsRef;
    const el = api.nativeElement as unknown as HTMLDivElement;
    expect(el).toBeTruthy();
    expect(el.classList.contains('ant-prompts')).toBe(true);

    wrapper.unmount();
  });
});
