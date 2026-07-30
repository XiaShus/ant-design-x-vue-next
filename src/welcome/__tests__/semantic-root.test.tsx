import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Welcome from '../Welcome.vue';

describe('Welcome semantic root', () => {
  it('applies classNames.root and styles.root', async () => {
    const wrapper = mount(Welcome, {
      props: {
        title: 'Hello',
        classNames: { root: 'welcome-root' },
        styles: { root: { marginBottom: '16px' } },
      },
    });
    await nextTick();

    const root = wrapper.find('.ant-welcome');
    expect(root.classes()).toContain('welcome-root');
    expect((root.element as HTMLElement).style.marginBottom).toBe('16px');

    wrapper.unmount();
  });
});
