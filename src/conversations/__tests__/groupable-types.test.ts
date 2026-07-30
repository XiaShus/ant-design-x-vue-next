import { describe, expect, it } from 'vitest';
import type {
  GroupCollapsible,
  GroupLabel,
  GroupSorter,
  GroupTitleRender,
  GroupTitleRenderComponents,
} from '../index';

describe('Conversations groupable type exports', () => {
  it('exports groupable helper types from package entry', () => {
    const collapsible = true satisfies GroupCollapsible;
    const byGroup = ((g: string) => g === 'a') satisfies GroupCollapsible;
    const label = 'Group' satisfies GroupLabel;
    const sorter: GroupSorter = () => 0;
    const title: GroupTitleRender = (group, info: GroupTitleRenderComponents) => {
      void group;
      void info;
      return null as any;
    };
    expect(collapsible).toBe(true);
    expect(byGroup('a')).toBe(true);
    expect(label).toBe('Group');
    expect(typeof sorter).toBe('function');
    expect(typeof title).toBe('function');
  });
});
