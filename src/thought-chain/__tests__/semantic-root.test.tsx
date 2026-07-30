import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import ThoughtChain from '../ThoughtChain.vue';

describe('ThoughtChain semantic root / itemIcon', () => {
  it('applies classNames/styles for root and itemIcon', async () => {
    const wrapper = mount(ThoughtChain, {
      props: {
        items: [{ key: '1', title: 'Step 1', content: 'Detail' }],
        classNames: {
          root: 'tc-root',
          itemIcon: 'tc-item-icon',
        },
        styles: {
          root: { paddingTop: '10px' },
          itemIcon: { opacity: '0.8' },
        },
      },
    });
    await nextTick();

    const root = wrapper.find('.ant-thought-chain');
    expect(root.classes()).toContain('tc-root');
    expect((root.element as HTMLElement).style.paddingTop).toBe('10px');

    const icon = wrapper.find('.ant-thought-chain-item-icon');
    expect(icon.exists()).toBe(true);
    expect(icon.classes()).toContain('tc-item-icon');
    expect((icon.element as HTMLElement).style.opacity).toBe('0.8');

    wrapper.unmount();
  });
});
