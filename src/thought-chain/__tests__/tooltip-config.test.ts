import { describe, expect, it } from 'vitest';
import type { TooltipConfig } from '../index';

describe('ThoughtChain TooltipConfig export', () => {
  it('exports TooltipConfig from package entry', () => {
    const config = {
      titleConfig: { title: 'title tip' },
      descriptionConfig: { title: 'desc tip' },
    } satisfies TooltipConfig;
    expect(config.titleConfig?.title).toBe('title tip');
    expect(config.descriptionConfig?.title).toBe('desc tip');
  });
});
