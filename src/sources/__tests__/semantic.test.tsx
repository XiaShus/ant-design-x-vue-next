import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Sources from '../Sources.vue';

describe('Sources classNames / styles', () => {
  it('applies semantic classNames and styles', () => {
    const wrapper = mount(Sources, {
      props: {
        title: 'Used 2 sources',
        defaultExpanded: true,
        items: [
          { key: '1', title: 'A', url: 'https://a.com' },
          { key: '2', title: 'B', url: 'https://b.com' },
        ],
        classNames: {
          root: 'custom-root',
          title: 'custom-title',
          content: 'custom-content',
        },
        styles: {
          root: { padding: '8px' },
          title: { color: 'rgb(22, 119, 255)' },
          content: { marginTop: '4px' },
        },
      },
    });

    expect(wrapper.classes()).toContain('custom-root');
    expect((wrapper.element as HTMLElement).style.padding).toBe('8px');

    const title = wrapper.find('.custom-title');
    expect(title.exists()).toBe(true);
    expect((title.element as HTMLElement).style.color).toBe('rgb(22, 119, 255)');

    const content = wrapper.find('.custom-content');
    expect(content.exists()).toBe(true);
    expect((content.element as HTMLElement).style.marginTop).toBe('4px');
  });
});
