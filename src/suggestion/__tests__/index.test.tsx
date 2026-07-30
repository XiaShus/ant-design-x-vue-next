import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import Suggestion from '../Suggestion.vue';
import type { SuggestionItem, SuggestionProps } from '../interface';

function MockSuggestion(props: SuggestionProps) {
  return h(
    Suggestion,
    props,
    {
      default: ({ onTrigger, onKeyDown }: { onTrigger: (info?: any) => void; onKeyDown: (e: KeyboardEvent) => void }) =>
        h('input', {
          onKeydown: (e: KeyboardEvent) => {
            if (e.key === '/') {
              onTrigger(e.key);
            } else if (e.key === 'Delete') {
              onTrigger(false);
            }
            onKeyDown(e);
          },
        }),
    },
  );
}

describe('Suggestion', () => {
  it('renders item icon and extra', async () => {
    const items: SuggestionItem[] = [
      {
        label: 'Suggestion 1',
        value: 'suggestion1',
        icon: h('div', { class: 'bamboo' }),
        extra: 'Extra Info',
      },
    ];
    mount(() => h(MockSuggestion, { items, open: true }));
    await nextTick();
    await nextTick();
    expect(document.querySelector('.bamboo')).toBeTruthy();
    expect(document.body.textContent).toContain('Extra Info');
    expect(document.querySelector('.ant-suggestion-item-icon')).toBeTruthy();
    expect(document.querySelector('.ant-suggestion-item-extra')).toBeTruthy();
  });

  it('onSelect receives value and selectedOptions', async () => {
    const onSelect = vi.fn();
    const items: SuggestionItem[] = [
      { label: 'Suggestion 1', value: 'suggestion1' },
      { label: 'Suggestion 2', value: 'suggestion2' },
    ];
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(MockSuggestion, { items, onSelect });
        },
      }),
      { attachTo: document.body },
    );
    const input = wrapper.find('input');
    await input.trigger('keydown', { key: '/' });
    await nextTick();
    await nextTick();
    // First item is activated on open; Enter selects leaf
    await input.trigger('keydown', { key: 'Enter' });
    await nextTick();

    expect(onSelect).toHaveBeenCalledWith('suggestion1', [
      { label: 'Suggestion 1', value: 'suggestion1' },
    ]);
    wrapper.unmount();
  });

  it('onTrigger(false) closes panel', async () => {
    const onOpenChange = vi.fn();
    const items: SuggestionItem[] = [{ label: 'Suggestion 1', value: 'suggestion1' }];
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(MockSuggestion, { items, onOpenChange });
        },
      }),
    );
    await wrapper.find('input').trigger('keydown', { key: '/' });
    expect(onOpenChange).toHaveBeenCalledWith(true);

    onOpenChange.mockReset();
    await wrapper.find('input').trigger('keydown', { key: 'Delete' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('passes open to children render props', async () => {
    let seenOpen: boolean | undefined;
    mount(
      defineComponent({
        setup() {
          return () =>
            h(
              Suggestion,
              { items: [{ label: 'A', value: 'a' }], open: true },
              {
                default: (props: { open: boolean }) => {
                  seenOpen = props.open;
                  return h('input');
                },
              },
            );
        },
      }),
    );
    await nextTick();
    expect(seenOpen).toBe(true);
  });

  it('Escape closes panel', async () => {
    const onOpenChange = vi.fn();
    const items: SuggestionItem[] = [{ label: 'Suggestion 1', value: 'suggestion1' }];
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => h(MockSuggestion, { items, onOpenChange });
        },
      }),
    );
    await wrapper.find('input').trigger('keydown', { key: '/' });
    onOpenChange.mockReset();
    await wrapper.find('input').trigger('keydown', { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
