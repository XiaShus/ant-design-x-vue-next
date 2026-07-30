<script setup lang="ts">
import { markRaw, provide, reactive, watch, type Component } from 'vue';
import { loadCatalog } from './catalog';
import { boxContextKey, type BoxContextValue } from './context';
import type { A2UICommand_v0_9, ActionPayload, BoxProps, Catalog } from './types';

defineOptions({ name: 'AXXCardBox' });

const props = withDefaults(defineProps<BoxProps>(), {
  commands: () => [],
  components: () => ({}),
});

function freezeComponents(map?: BoxProps['components']) {
  const next: Record<string, Component> = {};
  Object.entries(map || {}).forEach(([key, comp]) => {
    next[key] = markRaw(comp as Component);
  });
  return next;
}

const catalogMap = reactive(new Map<string, Catalog>());
const surfaceCatalogMap = reactive(new Map<string, string>());
let processedCount = 0;

const ctx = reactive<BoxContextValue>({
  components: freezeComponents(props.components),
  commandQueue: props.commands || [],
  onAction: props.onAction,
  allowedCatalogIds: props.allowedCatalogIds,
  catalogMap: catalogMap as Map<string, Catalog>,
  surfaceCatalogMap: surfaceCatalogMap as Map<string, string>,
});

provide(boxContextKey, ctx);

watch(
  () => props.components,
  (val) => {
    ctx.components = freezeComponents(val);
  },
);

watch(
  () => props.onAction,
  (val) => {
    ctx.onAction = val;
  },
);

watch(
  () => props.allowedCatalogIds,
  (val) => {
    ctx.allowedCatalogIds = val;
  },
);

watch(
  () => props.commands,
  (commands) => {
    const list = (commands || []) as A2UICommand_v0_9[];
    ctx.commandQueue = list;

    if (!list.length) {
      processedCount = 0;
      return;
    }
    if (list.length < processedCount) {
      processedCount = 0;
    }

    const newCommands = list.slice(processedCount);
    if (!newCommands.length) return;

    for (const cmd of newCommands) {
      if ('createSurface' in cmd) {
        const { surfaceId, catalogId } = cmd.createSurface;
        if (catalogId) {
          surfaceCatalogMap.set(surfaceId, catalogId);
          loadCatalog(catalogId, props.allowedCatalogIds)
            .then((catalog) => {
              if (!catalogMap.has(catalogId)) {
                catalogMap.set(catalogId, catalog);
              }
            })
            .catch((error) => {
              console.error(`Failed to load catalog ${catalogId}:`, error);
            });
        }
      }
      if ('deleteSurface' in cmd) {
        surfaceCatalogMap.delete(cmd.deleteSurface.surfaceId);
      }
    }
    processedCount = list.length;
  },
  { immediate: true, deep: true },
);

defineExpose({
  /** Host should call this when an action is handled at app level if needed */
  emitAction: (payload: ActionPayload) => props.onAction?.(payload),
});
</script>

<template>
  <div class="ant-x-card-box">
    <slot />
  </div>
</template>
