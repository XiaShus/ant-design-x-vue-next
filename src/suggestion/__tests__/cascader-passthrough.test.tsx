import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Suggestion from '../Suggestion.vue';
import type { SuggestionItem } from '../interface';

describe('Suggestion Cascader passthrough', () => {
  it('forwards expandTrigger like React otherProps', async () => {
    const items: SuggestionItem[] = [
      {
        label: 'Parent',
        value: 'parent',
        children: [{ label: 'Child', value: 'child' }],
      },
    ];
    const wrapper = mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Suggestion,
              {
                items,
                open: true,
                expandTrigger: 'hover',
                disabled: true,
              } as any,
              {
                default: () => h('input'),
              },
            );
        },
      }),
    );
    await nextTick();

    const cascader = wrapper.findComponent({ name: 'ACascader' });
    expect(cascader.exists()).toBe(true);
    expect(cascader.props('expandTrigger')).toBe('hover');
    expect(cascader.props('disabled')).toBe(true);
  });
});
