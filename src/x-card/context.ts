import type { InjectionKey } from 'vue';
import type { A2UICommand, ActionPayload, BoxProps, Catalog } from './types';

export interface BoxContextValue {
  components: NonNullable<BoxProps['components']>;
  commandQueue: A2UICommand[];
  onAction?: (payload: ActionPayload) => void;
  allowedCatalogIds?: string[];
  catalogMap: Map<string, Catalog>;
  surfaceCatalogMap: Map<string, string>;
}

export const boxContextKey: InjectionKey<BoxContextValue> = Symbol('A2UIBoxContext');
