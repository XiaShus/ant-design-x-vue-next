import { describe, expect, it } from 'vitest';
import { ShortcutKeyCode } from '../index';
import type { CreationProps, ShortcutKeys } from '../index';

describe('CreationProps / ShortcutKeys exports', () => {
  it('exports CreationProps from package entry', () => {
    const props = {
      align: 'center',
      disabled: false,
    } as const satisfies CreationProps;
    expect(props.align).toBe('center');
  });

  it('exports ShortcutKeys and ShortcutKeyCode from package entry', () => {
    const keys = ['Ctrl', ShortcutKeyCode.N] as const satisfies ShortcutKeys;
    expect(keys[1]).toBe(78);
  });
});
