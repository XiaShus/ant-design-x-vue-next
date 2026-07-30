import { describe, expect, it } from 'vitest';
import type { CreationAlign } from '../index';

describe('Conversations CreationAlign export', () => {
  it('exports CreationAlign from package entry', () => {
    const start = 'start' satisfies CreationAlign;
    const center = 'center' satisfies CreationAlign;
    const end = 'end' satisfies CreationAlign;
    expect(start).toBe('start');
    expect(center).toBe('center');
    expect(end).toBe('end');
  });
});
