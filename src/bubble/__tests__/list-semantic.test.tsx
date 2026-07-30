import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { Bubble } from '../index';

describe('Bubble.List semantic + role system/divider', () => {
  it('applies root / scroll / bubble classNames', async () => {
    const wrapper = mount(Bubble.List, {
      props: {
        items: [{ key: '1', content: 'Hello', role: 'ai' }],
        classNames: {
          root: 'list-root',
          scroll: 'list-scroll',
          bubble: 'list-bubble',
        },
        styles: {
          root: { borderWidth: '2px' },
        },
      },
    });
    await nextTick();

    const root = wrapper.find('.ant-bubble-list');
    expect(root.classes()).toContain('list-root');
    expect((root.element as HTMLElement).style.borderWidth).toBe('2px');
    expect(wrapper.find('.list-scroll').exists()).toBe(true);
    expect(wrapper.find('.list-bubble').exists()).toBe(true);

    wrapper.unmount();
  });

  it('renders system role with list semantic class', async () => {
    const wrapper = mount(Bubble.List, {
      props: {
        items: [{ key: 's', role: 'system', content: 'Welcome' }],
        classNames: { system: 'list-system' },
      },
    });
    await nextTick();

    expect(wrapper.find('.ant-bubble-system').exists()).toBe(true);
    expect(wrapper.find('.list-system').exists()).toBe(true);
    expect(wrapper.text()).toContain('Welcome');

    wrapper.unmount();
  });

  it('renders divider role with list semantic class', async () => {
    const wrapper = mount(Bubble.List, {
      props: {
        items: [{ key: 'd', role: 'divider', content: 'Today' }],
        classNames: { divider: 'list-divider' },
      },
    });
    await nextTick();

    expect(wrapper.find('.ant-bubble-divider').exists()).toBe(true);
    expect(wrapper.find('.list-divider').exists()).toBe(true);
    expect(wrapper.text()).toContain('Today');

    wrapper.unmount();
  });
});
