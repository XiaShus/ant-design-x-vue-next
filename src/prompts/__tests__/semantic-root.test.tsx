import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Prompts from '../Prompts.vue';

describe('Prompts semantic root', () => {
  it('applies classNames.root and styles.root', async () => {
    const wrapper = mount(Prompts, {
      props: {
        items: [{ key: '1', label: 'Hello' }],
        classNames: { root: 'prompts-root' },
        styles: { root: { paddingTop: '12px' } },
      },
    });
    await nextTick();

    const root = wrapper.find('.ant-prompts');
    expect(root.classes()).toContain('prompts-root');
    expect((root.element as HTMLElement).style.paddingTop).toBe('12px');

    wrapper.unmount();
  });
});
