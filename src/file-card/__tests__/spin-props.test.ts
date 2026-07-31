import { describe, expect, it } from 'vitest';
import type { FileCardSpinProps } from '../index';

describe('FileCardSpinProps export', () => {
  it('exports FileCardSpinProps from package entry', () => {
    const props = {
      showText: true,
      percent: 'auto',
      size: 'middle',
    } as const satisfies FileCardSpinProps;
    expect(props.percent).toBe('auto');
    expect(props.size).toBe('middle');
  });
});
