import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import List from '../List.vue';

describe('FileCard.List classNames / styles', () => {
  it('applies list root and card semantic classNames', () => {
    const wrapper = mount(List, {
      props: {
        items: [
          { name: 'a.pdf', byte: 100 },
          { name: 'b.docx', byte: 200 },
        ],
        classNames: {
          root: 'custom-list-root',
          card: 'custom-list-card',
        },
        styles: {
          root: { padding: '4px' },
        },
      },
    });

    expect(wrapper.classes()).toContain('custom-list-root');
    expect(wrapper.findAll('.custom-list-card').length).toBeGreaterThanOrEqual(2);
    expect(
      (wrapper.find('.ant-file-card-list-content').element as HTMLElement).style.padding,
    ).toBe('4px');
  });
});
