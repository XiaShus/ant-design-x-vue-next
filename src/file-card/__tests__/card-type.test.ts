import { describe, expect, it } from 'vitest';
import type { CardType, PresetIcons } from '../index';

describe('FileCard CardType / PresetIcons exports', () => {
  it('exports CardType from package entry', () => {
    const types = ['file', 'image', 'audio', 'video'] as const satisfies readonly CardType[];
    expect(types).toHaveLength(4);
  });

  it('exports PresetIcons from package entry', () => {
    const icons = [
      'default',
      'excel',
      'image',
      'markdown',
      'pdf',
      'ppt',
      'word',
      'zip',
      'video',
      'audio',
      'java',
      'javascript',
      'python',
    ] as const satisfies readonly PresetIcons[];
    expect(icons).toHaveLength(13);
  });
});
