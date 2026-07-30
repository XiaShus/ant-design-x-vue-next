import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Sources from '../Sources.vue';
import type { SourcesRef } from '../interface';

describe('Sources ref', () => {
  it('exposes nativeElement root', async () => {
    const wrapper = mount(Sources, {
      props: {
        title: 'Sources',
        items: [{ key: '1', title: 'Doc', url: 'https://example.com' }],
      },
    });
    await nextTick();

    const api = wrapper.vm as unknown as SourcesRef;
    const el = api.nativeElement as unknown as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.classList.contains('ant-sources')).toBe(true);

    wrapper.unmount();
  });
});
