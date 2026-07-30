import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Bubble from '../Bubble.vue';

describe('Bubble semantic root / body', () => {
  it('applies classNames/styles for root and body', async () => {
    const wrapper = mount(Bubble, {
      props: {
        content: 'Hello',
        classNames: {
          root: 'bubble-root',
          body: 'bubble-body',
        },
        styles: {
          root: { marginTop: '8px' },
          body: { gap: '4px' },
        },
      },
    });
    await nextTick();

    const root = wrapper.find('.ant-bubble');
    expect(root.classes()).toContain('bubble-root');
    expect((root.element as HTMLElement).style.marginTop).toBe('8px');

    const body = wrapper.find('.ant-bubble-body');
    expect(body.exists()).toBe(true);
    expect(body.classes()).toContain('bubble-body');
    expect(body.classes()).toContain('ant-bubble-content-wrapper');
    expect((body.element as HTMLElement).style.gap).toBe('4px');

    wrapper.unmount();
  });
});
