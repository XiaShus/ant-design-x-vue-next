import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Suggestion from '../Suggestion.vue';
import type { SuggestionItem } from '../interface';

describe('Suggestion semantic', () => {
  it('applies classNames/styles for root, content and popup', async () => {
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
                classNames: {
                  root: 'test-root',
                  content: 'test-content',
                  popup: 'test-popup',
                },
                styles: {
                  root: { color: 'rgb(1, 2, 3)' },
                  content: { marginTop: '8px' },
                  popup: { zIndex: 1234 },
                },
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

    const content = document.querySelector('.ant-suggestion-content') as HTMLElement;
    expect(content).toBeTruthy();
    expect(content.classList.contains('test-content')).toBe(true);
    expect(content.style.marginTop).toBe('8px');

    const popup = document.querySelector('.ant-suggestion.test-popup') as HTMLElement
      || document.querySelector('.test-popup') as HTMLElement;
    expect(popup).toBeTruthy();
    expect(popup.classList.contains('test-root') || document.querySelector('.test-root')).toBeTruthy();
    expect(popup.style.zIndex).toBe('1234');
  });
});
