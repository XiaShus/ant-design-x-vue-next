import { describe, expect, it } from 'vitest';
import type { ActionItem, ItemType, SubItemType } from '../index';

describe('Actions item type exports', () => {
  it('exports ItemType / SubItemType from package entry', () => {
    const item = {
      key: 'copy',
      label: 'Copy',
    } as const satisfies ItemType;
    const sub = {
      key: 'sub',
      label: 'Sub',
    } as const satisfies SubItemType;
    expect(item.key).toBe('copy');
    expect(sub.key).toBe('sub');
  });

  it('exports ActionItem from package entry', () => {
    const items: ActionItem[] = [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B', danger: true },
    ];
    expect(items).toHaveLength(2);
  });
});
