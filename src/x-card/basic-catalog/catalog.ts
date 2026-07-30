import type { Catalog } from '../types';

/** Default A2UI basic catalog id */
export const BASIC_CATALOG_ID = 'local://ant-design-x-vue-next/basic';

/**
 * Minimal A2UI Basic Catalog schema for starter components.
 */
export const basicCatalog: Catalog = {
  $id: BASIC_CATALOG_ID,
  catalogId: BASIC_CATALOG_ID,
  title: 'Ant Design X Vue Next Basic Catalog',
  components: {
    Text: {
      type: 'object',
      properties: { text: {}, variant: {} },
      required: ['text'],
    },
    Button: {
      type: 'object',
      properties: { text: {}, action: {}, variant: {} },
    },
    TextField: {
      type: 'object',
      properties: { label: {}, value: {}, placeholder: {}, variant: {} },
      required: ['label'],
    },
    CheckBox: {
      type: 'object',
      properties: { label: {}, value: {} },
      required: ['label', 'value'],
    },
    Column: {
      type: 'object',
      properties: { children: {}, justify: {}, align: {} },
    },
    Row: {
      type: 'object',
      properties: { children: {}, justify: {}, align: {} },
    },
    Divider: {
      type: 'object',
      properties: { axis: {} },
    },
    Image: {
      type: 'object',
      properties: { url: {}, description: {}, fit: {} },
      required: ['url'],
    },
    Card: {
      type: 'object',
      properties: { child: {}, children: {} },
    },
  },
};
