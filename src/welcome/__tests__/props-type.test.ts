import { describe, expect, it } from 'vitest';
import type { WelcomeProps, WelcomeRef } from '../index';

describe('WelcomeProps / WelcomeRef exports', () => {
  it('exports WelcomeProps from package entry', () => {
    const props = {
      title: 'Hello',
      variant: 'filled',
    } as const satisfies WelcomeProps;
    expect(props.title).toBe('Hello');
  });

  it('exports WelcomeRef from package entry', () => {
    const ref = {
      nativeElement: document.createElement('div'),
    } satisfies WelcomeRef;
    expect(ref.nativeElement).toBeInstanceOf(HTMLDivElement);
  });
});
