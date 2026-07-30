import { describe, expect, it } from 'vitest';
import type {
  ComponentStyleConfig,
  XComponentStyleConfig,
  XComponentsConfig,
} from '../index';

describe('XProvider config type exports', () => {
  it('exports XComponentsConfig and style config helpers', () => {
    const style: XComponentStyleConfig = {
      className: 'root',
      classNames: { root: 'r' },
    };
    const bubble: ComponentStyleConfig = {
      style: { color: 'red' },
    };
    const config: XComponentsConfig = {
      bubble,
      welcome: style,
    };
    expect(config.bubble?.style?.color).toBe('red');
    expect(config.welcome?.className).toBe('root');
  });
});
