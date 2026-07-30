import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Suggestion from '../Suggestion.vue';
import type { SuggestionItem } from '../interface';

describe('Suggestion getPopupContainer', () => {
  it('renders popup inside custom container', async () => {
    const host = document.createElement('div');
    host.id = 'suggestion-popup-host';
    document.body.appendChild(host);

    const items: SuggestionItem[] = [{ label: 'Suggestion 1', value: 'suggestion1' }];
    mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Suggestion,
              {
                items,
                open: true,
                getPopupContainer: () => host,
              },
              {
                default: () => h('input'),
              },
            );
        },
      }),
      { attachTo: document.body },
    );
    await nextTick();
    await nextTick();

    expect(host.querySelector('.ant-suggestion')).toBeTruthy();

    host.remove();
  });
});
