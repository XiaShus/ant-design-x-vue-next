import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';
import Actions from '../Actions.vue';
import type { ActionsRef } from '../interface';

describe('Actions ref', () => {
  it('exposes nativeElement root', async () => {
    const wrapper = mount(Actions, {
      props: {
        items: [{ key: 'copy', icon: h('span', 'C'), label: 'Copy' }],
      },
    });
    await nextTick();

    const api = wrapper.vm as unknown as ActionsRef;
    const el = api.nativeElement as unknown as HTMLDivElement;
    expect(el).toBeTruthy();
    expect(el.classList.contains('ant-actions')).toBe(true);

    wrapper.unmount();
  });
});
