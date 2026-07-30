import { describe, expect, it } from 'vitest';
import type { SubmitType } from '../index';

describe('Sender SubmitType export', () => {
  it('exports SubmitType from package entry', () => {
    const enter = 'enter' satisfies SubmitType;
    const shiftEnter = 'shiftEnter' satisfies SubmitType;
    const disabled = false satisfies SubmitType;
    expect(enter).toBe('enter');
    expect(shiftEnter).toBe('shiftEnter');
    expect(disabled).toBe(false);
  });
});
