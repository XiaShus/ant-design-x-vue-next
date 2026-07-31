import { describe, expect, it } from 'vitest';
import type { Collapsible, CollapsibleOptions } from '../index';

describe('Collapsible / CollapsibleOptions exports', () => {
  it('exports CollapsibleOptions from package entry', () => {
    const options = {
      defaultExpandedKeys: ['a'],
      expandedKeys: ['a', 'b'],
    } as const satisfies CollapsibleOptions;
    expect(options.defaultExpandedKeys).toEqual(['a']);
  });

  it('exports Collapsible from package entry', () => {
    const on: Collapsible = true;
    const off: Collapsible = false;
    const opts: Collapsible = { expandedKeys: ['x'] };
    expect(on).toBe(true);
    expect(off).toBe(false);
    expect(opts).toEqual({ expandedKeys: ['x'] });
  });
});
