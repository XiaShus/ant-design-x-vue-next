import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Actions from '../Actions.vue';

describe('Actions fadeIn', () => {
  it('applies fade motion class when fadeIn is true', async () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(Actions, {
              fadeIn: true,
              items: [{ key: '1', label: 'Retry' }],
            });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
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
            h(Actions, {
              fadeIn: true,
              fadeInLeft: true,
              items: [{ key: '1', label: 'Retry' }],
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
          return () => h(Actions, { items: [{ key: '1', label: 'Retry' }] });
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    expect(document.body.innerHTML.includes('ant-x-fade')).toBe(false);
    wrapper.unmount();
  });
});
