import { describe, expect, it } from 'vitest';
import type { BubbleContentType, InfoType, SlotInfoType } from '../index';

describe('Bubble content type exports', () => {
  it('exports BubbleContentType and SlotInfoType from package entry', () => {
    const content = 'hello' satisfies BubbleContentType;
    const info = { key: '1', status: 'success' as const } satisfies SlotInfoType;
    const infoAlias: InfoType = info;
    expect(content).toBe('hello');
    expect(infoAlias.key).toBe('1');
  });
});
