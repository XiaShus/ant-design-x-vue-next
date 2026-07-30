<script setup lang="tsx">
import { computed, h, inject, ref, watch, type Component, type VNodeChild } from 'vue';
import {
  applyDataModelUpdateV08,
  extractDataUpdatesV08,
  resolvePropsV08,
  type ActionConfigV08,
} from './Card.v0.8';
import { boxContextKey } from './context';
import { createComponentTransformer } from './format';
import {
  applyDataModelUpdateV09,
  extractDataUpdatesV09,
  resolvePropsV09,
  type ActionConfigV09,
} from './resolveProps';
import type { ComponentTree } from './types';
import {
  getValueByPath,
  isPathObject,
  setValueByPath,
  validateComponentAgainstCatalog,
} from './utils';

defineOptions({ name: 'AXXCard' });

const props = defineProps<{ id: string }>();

const ctx = inject(boxContextKey);
if (!ctx) {
  throw new Error('[XCard.Card] must be used inside XCard.Box');
}

const transformer = createComponentTransformer();
const rootNode = ref<ComponentTree | null>(null);
const dataModel = ref<Record<string, any>>({});
const commandVersion = ref<'v0.8' | 'v0.9'>('v0.8');
const hasRendered = ref(false);

const catalog = computed(() => {
  const catalogId = ctx.surfaceCatalogMap.get(props.id);
  return catalogId ? ctx.catalogMap.get(catalogId) : undefined;
});

watch(
  () => ctx.commandQueue,
  (commandQueue) => {
    if (!commandQueue.length) return;

    const myCommands = commandQueue.filter((cmd) => {
      if ('createSurface' in cmd) return cmd.createSurface.surfaceId === props.id;
      if ('updateComponents' in cmd) return cmd.updateComponents.surfaceId === props.id;
      if ('updateDataModel' in cmd) return cmd.updateDataModel.surfaceId === props.id;
      if ('deleteSurface' in cmd) return cmd.deleteSurface.surfaceId === props.id;
      if ('surfaceUpdate' in cmd) return cmd.surfaceUpdate.surfaceId === props.id;
      if ('dataModelUpdate' in cmd) return cmd.dataModelUpdate.surfaceId === props.id;
      if ('beginRendering' in cmd) return cmd.beginRendering.surfaceId === props.id;
      return false;
    });
    if (!myCommands.length) return;

    let nextDataModel = dataModel.value;
    let nextRoot = rootNode.value;
    let nextVersion = commandVersion.value;
    let dataChanged = false;
    let rootChanged = false;
    let versionChanged = false;

    for (const cmd of myCommands) {
      if ('version' in cmd && cmd.version === 'v0.9') {
        nextVersion = 'v0.9';
        versionChanged = true;

        if ('createSurface' in cmd && !hasRendered.value) {
          nextRoot = null;
          nextDataModel = {};
          rootChanged = true;
          dataChanged = true;
        }

        if ('updateComponents' in cmd) {
          const nodeTree = transformer.transform(cmd.updateComponents.components, 'v0.9');
          if (nodeTree) {
            nextRoot = nodeTree;
            hasRendered.value = true;
            rootChanged = true;
          }
        }

        if ('updateDataModel' in cmd) {
          nextDataModel = applyDataModelUpdateV09(
            nextDataModel,
            cmd.updateDataModel.path,
            cmd.updateDataModel.value,
          );
          dataChanged = true;
        }

        if ('deleteSurface' in cmd) {
          nextRoot = null;
          nextDataModel = {};
          hasRendered.value = false;
          rootChanged = true;
          dataChanged = true;
          transformer.reset();
        }
        continue;
      }

      // v0.8
      nextVersion = 'v0.8';
      versionChanged = true;

      if ('surfaceUpdate' in cmd) {
        transformer.transform(cmd.surfaceUpdate.components, 'v0.8');
        if (hasRendered.value) {
          const rootFromCache = transformer.getById('root');
          if (rootFromCache) {
            nextRoot = rootFromCache;
            rootChanged = true;
          }
        }
      }

      if ('dataModelUpdate' in cmd) {
        nextDataModel = applyDataModelUpdateV08(nextDataModel, cmd.dataModelUpdate.contents);
        dataChanged = true;
      }

      if ('beginRendering' in cmd) {
        const nodeTree = transformer.getById(cmd.beginRendering.root);
        if (nodeTree) {
          nextRoot = nodeTree;
          hasRendered.value = true;
          rootChanged = true;
        }
      }

      if ('deleteSurface' in cmd) {
        nextRoot = null;
        nextDataModel = {};
        hasRendered.value = false;
        rootChanged = true;
        dataChanged = true;
        transformer.reset();
      }
    }

    if (versionChanged) commandVersion.value = nextVersion;
    if (rootChanged) rootNode.value = nextRoot;
    if (dataChanged) dataModel.value = nextDataModel;
  },
  { deep: true, immediate: true },
);

type ActionConfig = ActionConfigV08 | ActionConfigV09;

function resolveActionContextPathRefs(
  actionConfig: any,
  componentContext: Record<string, any>,
  model: Record<string, any>,
): Record<string, any> {
  if (!actionConfig) return componentContext;

  const v09Context = actionConfig?.event?.context;
  if (v09Context && typeof v09Context === 'object' && !Array.isArray(v09Context)) {
    const resolvedFromConfig: Record<string, any> = {};
    for (const [key, val] of Object.entries(v09Context)) {
      if (isPathObject(val)) {
        const actualValue = getValueByPath(model, (val as { path: string }).path);
        const { path: _path, ...rest } = val as { path: string; [key: string]: any };
        resolvedFromConfig[key] = { ...rest, value: actualValue };
      } else {
        resolvedFromConfig[key] = val;
      }
    }
    return { ...resolvedFromConfig, ...componentContext };
  }

  const v08Context = actionConfig?.context;
  if (Array.isArray(v08Context)) {
    const resolvedFromConfig: Record<string, any> = {};
    for (const item of v08Context) {
      const { key, value: val } = item as { key: string; value: any };
      if (key === undefined) continue;
      if (isPathObject(val)) {
        resolvedFromConfig[key] = { value: getValueByPath(model, val.path) };
      } else {
        resolvedFromConfig[key] = val;
      }
    }
    return { ...resolvedFromConfig, ...componentContext };
  }

  return componentContext;
}

function handleAction(name: string, context: Record<string, any>, actionConfig?: ActionConfig) {
  const dataUpdates =
    commandVersion.value === 'v0.9'
      ? extractDataUpdatesV09(actionConfig as ActionConfigV09, context)
      : extractDataUpdatesV08(actionConfig as ActionConfigV08, context);

  let newDataModel = dataModel.value;
  if (dataUpdates.length > 0) {
    newDataModel = dataUpdates.reduce(
      (prev, { path, value }) => setValueByPath(prev, path, value),
      dataModel.value,
    );
    dataModel.value = newDataModel;
  }
  const resolvedContext = resolveActionContextPathRefs(actionConfig, context, newDataModel);
  ctx.onAction?.({
    name,
    surfaceId: props.id,
    context: resolvedContext,
  });
}

function handleDataChange(path: string, value: any) {
  dataModel.value = setValueByPath(dataModel.value, path, value);
}

function renderNode(node: ComponentTree): VNodeChild {
  const validation = validateComponentAgainstCatalog(catalog.value, node.type, node.props);
  if (!validation.valid) {
    validation.errors.forEach((error) => console.warn(error));
  }

  const Comp = ctx.components[node.type] as Component | undefined;
  if (!Comp) {
    console.warn(
      `Component "${node.type}" is not registered. Provide it via Box components prop.`,
    );
    return null;
  }

  const resolvedProps =
    commandVersion.value === 'v0.9'
      ? resolvePropsV09(node.props, dataModel.value)
      : resolvePropsV08(node.props, dataModel.value);

  resolvedProps.onAction = (name: string, context: Record<string, any>) => {
    handleAction(name, context, resolvedProps.action);
  };
  resolvedProps.onDataChange = handleDataChange;

  const children = (node.children || [])
    .map((childId) => {
      const child = transformer.getById(childId);
      return child ? renderNode(child) : null;
    })
    .filter(Boolean);

  return h(Comp, resolvedProps, () => children);
}

defineRender(() => {
  if (!rootNode.value) return null;
  return <div class="ant-x-card">{renderNode(rootNode.value)}</div>;
});
</script>
