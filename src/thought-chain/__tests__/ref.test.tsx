import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import ThoughtChain from '../ThoughtChain.vue';
import type { ThoughtChainRef } from '../interface';

describe('ThoughtChain ref', () => {
  it('exposes nativeElement root', async () => {
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [{ key: '1', title: 'Step 1' }],
      },
    });
    await nextTick();

    const api = wrapper.vm as unknown as ThoughtChainRef;
    const el = api.nativeElement as unknown as HTMLDivElement;
    expect(el).toBeTruthy();
    expect(el.classList.contains('ant-thought-chain')).toBe(true);

    wrapper.unmount();
  });
});
