import type { BaseComponent_v0_9, ComponentTree } from './types';
import { isPathObject } from './utils';

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
  transform(components: BaseComponent_v0_9[], version?: 'v0.9'): ComponentTree | null;
  getById(id: string): ComponentTree | undefined;
  reset(): void;
}

export function createComponentTransformer(): ComponentTransformer {
  const componentMap = new Map<string, ComponentTree>();

  function transform(components: BaseComponent_v0_9[]): ComponentTree | null {
    if (!Array.isArray(components) || components.length === 0) {
      return componentMap.get('root') ?? null;
    }
    for (const comp of components) {
      componentMap.set(comp.id, parseV09Node(comp));
    }
    return componentMap.get('root') ?? null;
  }

  return {
    transform,
    getById: (id) => componentMap.get(id),
    reset: () => componentMap.clear(),
  };
}
