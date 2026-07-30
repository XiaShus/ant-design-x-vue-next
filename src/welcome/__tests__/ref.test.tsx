import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Welcome from '../Welcome.vue';
import type { WelcomeRef } from '../interface';

describe('Welcome ref', () => {
  it('exposes nativeElement root', async () => {
    const wrapper = mount(Welcome, {
      props: {
        title: 'Hello',
      },
    });
    await nextTick();

    const api = wrapper.vm as unknown as WelcomeRef;
    const el = api.nativeElement;
    expect(el).toBeTruthy();
    expect(el.classList.contains('ant-welcome')).toBe(true);

    wrapper.unmount();
  });
});
