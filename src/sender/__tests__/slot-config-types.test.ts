import { describe, expect, it } from 'vitest';
import type {
  SlotConfigContentType,
  SlotConfigCustomType,
  SlotConfigInputType,
  SlotConfigSelectType,
  SlotConfigTagType,
  SlotConfigTextType,
  SlotConfigType,
} from '../index';

describe('Sender SlotConfig member type exports', () => {
  it('exports SlotConfig*Type members from package entry', () => {
    const text = { type: 'text', value: 'hi' } satisfies SlotConfigTextType;
    const input = { type: 'input', key: 'q' } satisfies SlotConfigInputType;
    const select = {
      type: 'select',
      key: 's',
      props: { options: ['a'] },
    } satisfies SlotConfigSelectType;
    const tag = {
      type: 'tag',
      key: 't',
      props: { label: 'Tag' },
    } satisfies SlotConfigTagType;
    const custom = { type: 'custom', key: 'c' } satisfies SlotConfigCustomType;
    const content = { type: 'content', key: 'body' } satisfies SlotConfigContentType;
    const union: SlotConfigType[] = [text, input, select, tag, custom, content];
    expect(union).toHaveLength(6);
  });
});
