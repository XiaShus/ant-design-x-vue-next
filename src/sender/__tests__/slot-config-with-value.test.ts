import { describe, expect, it } from 'vitest';
import type { SlotConfigBaseType, SlotConfigWithValue } from '../index';

describe('Sender SlotConfigBaseType / SlotConfigWithValue exports', () => {
  it('exports base and with-value slot config types', () => {
    const base = { type: 'text' as const } satisfies SlotConfigBaseType;
    const withValue = {
      type: 'input' as const,
      key: 'q',
      value: 'hello',
    } satisfies SlotConfigWithValue;
    expect(base.type).toBe('text');
    expect(withValue.value).toBe('hello');
  });
});
