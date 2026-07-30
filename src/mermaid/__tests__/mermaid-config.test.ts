import { describe, expect, it } from 'vitest';
import type { MermaidConfig } from '../index';

describe('MermaidConfig re-export', () => {
  it('re-exports MermaidConfig from package entry', () => {
    const config = {
      theme: 'dark',
      fontFamily: 'monospace',
    } satisfies MermaidConfig;
    expect(config.theme).toBe('dark');
    expect(config.fontFamily).toBe('monospace');
  });
});
