import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Prompts from '../Prompts.vue';

describe('Prompts fadeIn', () => {
  it('applies fade motion class when fadeIn is true', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Prompts, {
              fadeIn: true,
              items: [{ key: '1', label: 'Hello' }],
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    const root = document.querySelector('.ant-prompts');
    expect(root).toBeTruthy();
    const className = root!.className;
    expect(className.includes('ant-x-fade') || className.includes('ant-prompts')).toBe(true);
    // During appear, motion classes should be present on the animated node
    expect(
      document.body.innerHTML.includes('ant-x-fade') ||
        !!document.querySelector('[class*="ant-x-fade"]'),
    ).toBe(true);
    wrapper.unmount();
  });

  it('prefers fadeInLeft over fadeIn', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Prompts, {
              fadeIn: true,
              fadeInLeft: true,
              items: [{ key: '1', label: 'Hello' }],
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(document.body.innerHTML.includes('ant-x-fade-left')).toBe(true);
    wrapper.unmount();
  });

  it('does not apply fade class when props are off', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Prompts, {
              items: [{ key: '1', label: 'Hello' }],
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(document.body.innerHTML.includes('ant-x-fade')).toBe(false);
    wrapper.unmount();
  });
});
