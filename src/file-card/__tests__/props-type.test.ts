import { describe, expect, it } from 'vitest';
import type { FileCardListProps, FileCardProps } from '../index';

describe('FileCardProps / FileCardListProps exports', () => {
  it('exports FileCardProps from package entry', () => {
    const props = {
      name: 'a.pdf',
      type: 'file',
    } as const satisfies FileCardProps;
    expect(props.name).toBe('a.pdf');
  });

  it('exports FileCardListProps from package entry', () => {
    const props = {
      items: [{ name: 'a.pdf' }],
    } as const satisfies FileCardListProps;
    expect(props.items).toHaveLength(1);
  });
});
