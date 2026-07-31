import { describe, expect, it } from 'vitest';
import type { ActionPayload, BoxProps, Catalog, CatalogComponent } from '../index';

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
});
