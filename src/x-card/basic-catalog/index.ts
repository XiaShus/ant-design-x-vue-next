import { markRaw, type Component } from 'vue';
import { registerCatalog } from '../catalog';
import {
  A2UIButton,
  A2UICard,
  A2UICheckBox,
  A2UIColumn,
  A2UIDivider,
  A2UIImage,
  A2UIRow,
  A2UIText,
  A2UITextField,
} from './components';
import { BASIC_CATALOG_ID, basicCatalog } from './catalog';

export {
  A2UIText,
  A2UIButton,
  A2UITextField,
  A2UICheckBox,
  A2UIColumn,
  A2UIRow,
  A2UIDivider,
  A2UIImage,
  A2UICard,
  basicCatalog,
  BASIC_CATALOG_ID,
};

export type BasicCatalogComponents = Record<string, Component>;

/**
 * Vue component map for the Basic Catalog (ant-design-vue wrappers).
 */
export function createBasicCatalogComponents(): BasicCatalogComponents {
  return {
    Text: markRaw(A2UIText),
    Button: markRaw(A2UIButton),
    TextField: markRaw(A2UITextField),
    CheckBox: markRaw(A2UICheckBox),
    Column: markRaw(A2UIColumn),
    Row: markRaw(A2UIRow),
    Divider: markRaw(A2UIDivider),
    Image: markRaw(A2UIImage),
    Card: markRaw(A2UICard),
  };
}

/**
 * Register the built-in basic catalog (`local://ant-design-x-vue-next/basic`).
 * Call once at app bootstrap.
 */
export function registerBasicCatalog(): CatalogLike {
  registerCatalog(basicCatalog);
  return {
    catalogId: BASIC_CATALOG_ID,
    components: createBasicCatalogComponents(),
  };
}

interface CatalogLike {
  catalogId: string;
  components: BasicCatalogComponents;
}
