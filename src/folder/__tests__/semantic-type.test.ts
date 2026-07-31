import { describe, expect, it } from 'vitest';
import type { FolderSemanticType } from '../index';

describe('FolderSemanticType export', () => {
  it('exports FolderSemanticType from package entry', () => {
    const keys = [
      'root',
      'directoryTree',
      'directoryTitle',
      'filePreview',
      'previewTitle',
      'previewRender',
    ] as const satisfies readonly FolderSemanticType[];
    expect(keys).toHaveLength(6);
  });
});
