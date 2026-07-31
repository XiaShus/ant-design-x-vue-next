import { describe, expect, it } from 'vitest';
import type { MermaidProps, MermaidRef } from '../index';

describe('MermaidProps / MermaidRef exports', () => {
  it('exports MermaidProps from package entry', () => {
    const props = {
      children: 'graph TD; A-->B;',
    } as const satisfies MermaidProps;
    expect(props.children).toContain('graph');
  });

  it('exports MermaidRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
    } satisfies MermaidRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLDivElement);
  });
});
