import { describe, expect, it } from 'vitest';
import type { SuggestionItem, SuggestionProps } from '../index';

describe('SuggestionProps / SuggestionItem exports', () => {
  it('exports SuggestionItem from package entry', () => {
    const item = {
      label: 'A',
      value: 'a',
    } as const satisfies SuggestionItem;
    expect(item.value).toBe('a');
  });

  it('exports SuggestionProps from package entry', () => {
    const props = {
      items: [{ label: 'A', value: 'a' }],
      block: true,
    } as const satisfies SuggestionProps;
    expect(props.block).toBe(true);
  });
});
