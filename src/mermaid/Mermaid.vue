<script setup lang="tsx">
import {
  CopyOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons-vue';
import { useThrottleFn } from '@vueuse/core';
import { Segmented } from 'ant-design-vue';
import classnames from 'classnames';
import mermaid from 'mermaid';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type VNode } from 'vue';
import pickAttrs from '../_util/pick-attrs';
import warning from '../_util/warning';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { Actions, type ActionItem } from '../actions';
import { CodeHighlighter } from '../code-highlighter';
import useLocale from '../locale/useLocale';
import { useXProviderContext } from '../x-provider';
import useStyle from './style';
import type { MermaidProps, MermaidRef, MermaidRenderType, MermaidSlots } from './interface';

defineOptions({ name: 'AXMermaid' });

const [locale] = useLocale('Mermaid');

const props = withDefaults(defineProps<MermaidProps>(), {
  styles: () => ({}),
  classNames: () => ({}),
  actions: () => ({}),
});

const slots = defineSlots<MermaidSlots>();

const emit = defineEmits<{
  renderTypeChange: [value: MermaidRenderType];
}>();

let uuid = 0;

const rootRef = ref<HTMLDivElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const renderType = ref<MermaidRenderType>('image');
const scale = ref(1);
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const lastMousePos = ref({ x: 0, y: 0 });
const diagramId = `mermaid-${uuid++}`;

const domProps = computed(() =>
  pickAttrs(props, {
    attr: true,
    aria: true,
    data: true,
  }),
);

const { getPrefixCls, direction } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('mermaid', props.prefixCls));
const contextConfig = useXComponentConfig('mermaid');
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const codeText = computed(() => {
  if (typeof props.children === 'string') {
    return props.children;
  }
  const slotNodes = slots.default?.();
  if (!slotNodes) {
    return '';
  }
  const nodes = Array.isArray(slotNodes) ? slotNodes : [slotNodes];
  return nodes
    .map((node) => {
      if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
      }
      if (node && typeof node === 'object' && 'children' in node) {
        const child = (node as any).children;
        if (typeof child === 'string' || typeof child === 'number') {
          return String(child);
        }
      }
      return '';
    })
    .join('');
});

const mergedCls = computed(() =>
  classnames(
    prefixCls.value,
    contextConfig.value.className,
    props.className,
    props.class,
    props.rootClassName,
    contextConfig.value.classNames?.root,
    props.classNames.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const mergedStyle = computed(() => ({
  ...props.style,
  ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
  ...(typeof contextConfig.value.styles?.root === 'object' ? contextConfig.value.styles.root : {}),
  ...props.styles.root,
}));

watch(
  () => props.config,
  (config) => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'default',
      fontFamily: 'monospace',
      ...(config || {}),
    });
  },
  { immediate: true, deep: true },
);

const renderDiagram = useThrottleFn(async () => {
  const children = codeText.value;
  if (!children || !containerRef.value || renderType.value === 'code') {
    return;
  }

  try {
    const isValid = await mermaid.parse(children, { suppressErrors: true });
    if (!isValid) {
      throw new Error('Invalid Mermaid syntax');
    }

    const { svg } = await mermaid.render(`${diagramId}-${children.length}`, children);
    if (containerRef.value) {
      containerRef.value.innerHTML = svg;
      applyTransform();
    }
  } catch (error) {
    warning(false, 'Mermaid', `Render failed: ${error}`);
  }
}, 100);

const applyTransform = () => {
  const svg = containerRef.value?.querySelector('svg') as SVGElement | null;
  if (!svg || renderType.value !== 'image') {
    return;
  }
  svg.style.transform = `scale(${scale.value}) translate(${position.value.x}px, ${position.value.y}px)`;
  svg.style.transformOrigin = 'center';
  svg.style.transition = isDragging.value ? 'none' : 'transform 0.1s ease-out';
  svg.style.cursor = isDragging.value ? 'grabbing' : 'grab';
};

watch(
  [codeText, renderType, () => props.config],
  async () => {
    await nextTick();
    if (renderType.value === 'code' && containerRef.value) {
      containerRef.value.innerHTML = '';
      return;
    }
    await renderDiagram();
  },
  { immediate: true, deep: true },
);

watch([scale, position, renderType, isDragging], () => {
  applyTransform();
});

let lastWheelTime = 0;
const wheelHandler = (e: WheelEvent) => {
  const { enableZoom = true } = props.actions || {};
  if (!enableZoom || renderType.value !== 'image') {
    return;
  }
  e.preventDefault();
  e.stopPropagation();

  const now = Date.now();
  if (now - lastWheelTime < 16) {
    return;
  }
  lastWheelTime = now;

  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  scale.value = Math.max(0.5, Math.min(3, scale.value + delta));
};

onMounted(() => {
  containerRef.value?.addEventListener('wheel', wheelHandler, { passive: false });
});

onBeforeUnmount(() => {
  containerRef.value?.removeEventListener('wheel', wheelHandler);
});

watch(renderType, async () => {
  await nextTick();
  containerRef.value?.removeEventListener('wheel', wheelHandler);
  containerRef.value?.addEventListener('wheel', wheelHandler, { passive: false });
});

const handleMouseDown = (e: MouseEvent) => {
  if (renderType.value !== 'image') {
    return;
  }
  e.preventDefault();
  isDragging.value = true;
  lastMousePos.value = { x: e.clientX, y: e.clientY };
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || renderType.value !== 'image') {
    return;
  }
  e.preventDefault();
  const deltaX = e.clientX - lastMousePos.value.x;
  const deltaY = e.clientY - lastMousePos.value.y;
  position.value = {
    x: position.value.x + deltaX / scale.value,
    y: position.value.y + deltaY / scale.value,
  };
  lastMousePos.value = { x: e.clientX, y: e.clientY };
};

const handleMouseUp = () => {
  isDragging.value = false;
};

const handleReset = () => {
  scale.value = 1;
  position.value = { x: 0, y: 0 };
};

const handleDownload = async () => {
  const svgElement = containerRef.value?.querySelector('svg');
  if (!svgElement) {
    return;
  }

  const svgString = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const { width, height } = svgElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);
    const link = document.createElement('a');
    link.download = `${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1);
    link.click();
  };
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
};

const handleZoomIn = () => {
  scale.value = Math.min(scale.value + 0.2, 3);
};

const handleZoomOut = () => {
  scale.value = Math.max(scale.value - 0.2, 0.5);
};

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(codeText.value);
  } catch {
    // ignore clipboard errors
  }
};

const handleRenderTypeChange = (value: string | number) => {
  const next = value as MermaidRenderType;
  renderType.value = next;
  props.onRenderTypeChange?.(next);
  emit('renderTypeChange', next);
};

const resolveHeader = (): any => {
  if (slots.header) {
    return slots.header();
  }
  if (props.header !== undefined) {
    const result =
      typeof props.header === 'function'
        ? (props.header as () => VNode | string | null)()
        : props.header;
    return result;
  }
  return undefined;
};

const actionItems = computed((): ActionItem[] => {
  const {
    enableZoom = true,
    enableDownload = true,
    enableCopy = true,
    customActions = [],
  } = props.actions || {};

  const items: ActionItem[] = [];

  if (renderType.value === 'image') {
    if (enableZoom) {
      items.push(
        {
          key: 'zoomIn',
          icon: <ZoomInOutlined />,
          label: locale.value.zoomIn,
          onItemClick: handleZoomIn,
        },
        {
          key: 'zoomOut',
          icon: <ZoomOutOutlined />,
          label: locale.value.zoomOut,
          onItemClick: handleZoomOut,
        },
        {
          key: 'zoomReset',
          icon: <ReloadOutlined />,
          label: locale.value.zoomReset,
          onItemClick: handleReset,
        },
      );
    }
    if (enableDownload) {
      items.push({
        key: 'download',
        icon: <DownloadOutlined />,
        label: locale.value.download,
        onItemClick: handleDownload,
      });
    }
  } else if (enableCopy) {
    items.push({
      key: 'copy',
      icon: <CopyOutlined />,
      label: 'Copy',
      onItemClick: handleCopy,
    });
  }

  return [...items, ...customActions];
});

defineExpose<MermaidRef>({
  get nativeElement() {
    return rootRef.value;
  },
});

defineRender(() => {
  const children = codeText.value;
  if (!children) {
    return null;
  }

  const headerResult = resolveHeader();
  let headerNode: any;
  if (headerResult === null) {
    headerNode = null;
  } else if (headerResult === undefined) {
    headerNode = (
      <div
        class={classnames(
          `${prefixCls.value}-header`,
          contextConfig.value.classNames?.header,
          props.classNames.header,
        )}
        style={{
          ...(typeof contextConfig.value.styles?.header === 'object'
            ? contextConfig.value.styles.header
            : {}),
          ...props.styles.header,
        }}
      >
        <Segmented
          options={[
            { label: locale.value.image, value: 'image' },
            { label: locale.value.code, value: 'code' },
          ]}
          value={renderType.value}
          onChange={handleRenderTypeChange}
        />
        <Actions items={actionItems.value} />
      </div>
    );
  } else {
    headerNode = headerResult;
  }

  return wrapCSSVar(
    <div {...domProps.value} ref={rootRef} class={mergedCls.value} style={mergedStyle.value}>
      {headerNode}
      <div
        ref={containerRef}
        class={classnames(
          `${prefixCls.value}-graph`,
          contextConfig.value.classNames?.graph,
          renderType.value === 'code' && `${prefixCls.value}-graph-hidden`,
          props.classNames.graph,
        )}
        style={{
          ...(typeof contextConfig.value.styles?.graph === 'object'
            ? contextConfig.value.styles.graph
            : {}),
          ...props.styles.graph,
        }}
        onMousedown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onMouseleave={handleMouseUp}
      />
      {renderType.value === 'code' ? (
        <div
          class={classnames(
            `${prefixCls.value}-code`,
            contextConfig.value.classNames?.code,
            props.classNames.code,
          )}
          style={{
            ...(typeof contextConfig.value.styles?.code === 'object'
              ? contextConfig.value.styles.code
              : {}),
            ...props.styles.code,
          }}
        >
          <CodeHighlighter
            lang="mermaid"
            header={null}
            styles={{
              code: {
                background: 'transparent',
                border: 'none',
                borderRadius: 0,
              },
            }}
            highlightProps={{
              style: {
                padding: 0,
                background: 'transparent',
              },
              ...props.highlightProps,
            }}
          >
            {children}
          </CodeHighlighter>
        </div>
      ) : null}
    </div>,
  );
});
</script>
