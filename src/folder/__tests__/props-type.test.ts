import { describe, expect, it } from 'vitest';
import type { FolderProps, FolderRef, FolderTreeData } from '../index';

describe('FolderProps / FolderRef / FolderTreeData exports', () => {
  it('exports FolderTreeData from package entry', () => {
    const node = {
      title: 'a.ts',
      path: 'a.ts',
      content: 'x',
    } as const satisfies FolderTreeData;
    expect(node.path).toBe('a.ts');
  });

  it('exports FolderProps from package entry', () => {
    const props = {
      treeData: [],
      selectable: true,
    } as const satisfies FolderProps;
    expect(props.selectable).toBe(true);
  });

  it('exports FolderRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
      getNode: () => undefined,
      updateNode: () => [],
      deleteNode: () => [],
      addNode: () => [],
    } satisfies FolderRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLDivElement);
  });
});
