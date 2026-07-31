import { describe, expect, it } from 'vitest';
import type {
  A2UICommand,
  A2UICommand_v0_8,
  A2UICommand_v0_9,
  ActionPayload,
  BoxProps,
  Catalog,
  CatalogComponent,
} from '../index';

describe('XCard type exports', () => {
  it('exports ActionPayload / Catalog / CatalogComponent / BoxProps', () => {
    const payload = {
      name: 'submit',
      surfaceId: 'main',
      context: { ok: true },
    } as const satisfies ActionPayload;

    const component = {
      type: 'object',
      properties: { text: { type: 'string' } },
    } as const satisfies CatalogComponent;

    const catalog = {
      $id: 'local://demo',
      components: { Text: component },
    } as const satisfies Catalog;

    const props = {
      allowedCatalogIds: ['local://demo'],
      onAction: (_p: ActionPayload) => undefined,
    } as const satisfies BoxProps;

    expect(payload.name).toBe('submit');
    expect(catalog.$id).toBe('local://demo');
    expect(props.allowedCatalogIds).toHaveLength(1);
  });

  it('exports A2UICommand / A2UICommand_v0_8 / A2UICommand_v0_9', () => {
    const v09 = {
      version: 'v0.9',
      createSurface: { surfaceId: 'main', catalogId: 'local://demo' },
    } as A2UICommand_v0_9;
    const cmds: A2UICommand[] = [v09];
    const _assertV08: A2UICommand_v0_8 | undefined = undefined;
    expect(cmds).toHaveLength(1);
    expect(_assertV08).toBeUndefined();
  });
});
