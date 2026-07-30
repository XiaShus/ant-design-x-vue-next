import type {
  BaseComponent_v0_9,
  ComponentTree,
  ComponentWrapper_v0_8,
  ExplicitList,
} from './types';
import { isPathObject } from './utils';

function isLiteralStringValue(val: any): val is { literalString: string } {
  return val !== null && typeof val === 'object' && typeof val.literalString === 'string';
}

function isExplicitList(val: any): val is ExplicitList {
  return val !== null && typeof val === 'object' && Array.isArray(val.explicitList);
}

function parseV08Node(comp: ComponentWrapper_v0_8): ComponentTree {
  const [type, config] = Object.entries(comp.component)[0];
  const props: Record<string, any> = {};
  for (const [key, val] of Object.entries(config)) {
    if (['child', 'children'].includes(key)) continue;
    if (isPathObject(val)) {
      props[key] = val.path;
    } else if (isLiteralStringValue(val)) {
      props[key] = val.literalString;
    } else {
      props[key] = val;
    }
  }

  let childIds: string[] = [];
  if (config.children) {
    if (isExplicitList(config.children)) {
      childIds = config.children.explicitList;
    } else if (Array.isArray(config.children)) {
      childIds = config.children;
    }
  } else if (config.child) {
    childIds = [config.child];
  }

  return {
    type,
    props,
    ...(childIds.length > 0 && { children: childIds }),
  };
}

function parseV09Node(comp: BaseComponent_v0_9): ComponentTree {
  const type = comp.component;
  const props: Record<string, any> = {};
  for (const [key, val] of Object.entries(comp)) {
    if (['id', 'component', 'child', 'children'].includes(key)) continue;
    props[key] = isPathObject(val) ? val.path : val;
  }
  const childIds: string[] = comp.children ?? (comp.child ? [comp.child] : []);
  return {
    type,
    props,
    ...(childIds.length > 0 && { children: childIds }),
  };
}

export interface ComponentTransformer {
  transform(
    components: ComponentWrapper_v0_8[] | BaseComponent_v0_9[],
    version?: 'v0.8' | 'v0.9',
  ): ComponentTree | null;
  getById(id: string): ComponentTree | undefined;
  reset(): void;
}

export function createComponentTransformer(): ComponentTransformer {
  const componentMap = new Map<string, ComponentTree>();

  function transform(
    components: ComponentWrapper_v0_8[] | BaseComponent_v0_9[],
    version: 'v0.8' | 'v0.9' = 'v0.8',
  ): ComponentTree | null {
    if (!Array.isArray(components) || components.length === 0) {
      return componentMap.get('root') ?? null;
    }

    if (version === 'v0.8') {
      for (const comp of components as ComponentWrapper_v0_8[]) {
        componentMap.set(comp.id, parseV08Node(comp));
      }
    } else {
      for (const comp of components as BaseComponent_v0_9[]) {
        componentMap.set(comp.id, parseV09Node(comp));
      }
    }

    return componentMap.get('root') ?? null;
  }

  return {
    transform,
    getById: (id) => componentMap.get(id),
    reset: () => componentMap.clear(),
  };
}
