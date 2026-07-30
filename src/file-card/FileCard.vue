<script setup lang="tsx">
import classnames from 'classnames';
import { computed, type VNode } from 'vue';
import {
  FileExcelFilled,
  FileImageFilled,
  FileMarkdownFilled,
  FilePdfFilled,
  FilePptFilled,
  FileTextFilled,
  FileWordFilled,
  FileZipFilled,
} from '@ant-design/icons-vue';
import { Image, Spin } from 'ant-design-vue';
import pickAttrs from '../_util/pick-attrs';
import useXComponentConfig from '../_util/hooks/use-x-component-config';
import { useXProviderContext } from '../x-provider';
import AudioIcon from './icons/AudioIcon.vue';
import JavaIcon from './icons/JavaIcon.vue';
import JavaScriptIcon from './icons/JavaScriptIcon.vue';
import PythonIcon from './icons/PythonIcon.vue';
import VideoIcon from './icons/VideoIcon.vue';
import useStyle from './style';
import { getSize, matchExt } from './utils';
import type { CardInfo, CardType, FileCardProps, PresetIcons } from './interface';

defineOptions({ name: 'AXFileCard' });

const props = withDefaults(defineProps<FileCardProps>(), {
  size: 'default',
  styles: () => ({}),
  classNames: () => ({}),
});

const emit = defineEmits<{
  click: [info: CardInfo, event: MouseEvent];
}>();

const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'jfif'];
const AUDIO_EXT = ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'];
const VIDEO_EXT = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];

const PRESET_FILE_ICONS: {
  ext: string[];
  color: string;
  icon: VNode;
  key: PresetIcons;
}[] = [
  { icon: <FileExcelFilled />, color: '#22b35e', ext: ['xlsx', 'xls'], key: 'excel' },
  { icon: <FileImageFilled />, color: '#8c8c8c', ext: IMAGE_EXT, key: 'image' },
  { icon: <FileMarkdownFilled />, color: '#8c8c8c', ext: ['md', 'mdx'], key: 'markdown' },
  { icon: <FilePdfFilled />, color: '#ff4d4f', ext: ['pdf'], key: 'pdf' },
  { icon: <FilePptFilled />, color: '#ff6e31', ext: ['ppt', 'pptx'], key: 'ppt' },
  { icon: <FileWordFilled />, color: '#1677ff', ext: ['doc', 'docx'], key: 'word' },
  { icon: <FileZipFilled />, color: '#fab714', ext: ['zip', 'rar', '7z', 'tar', 'gz'], key: 'zip' },
  { icon: <VideoIcon />, color: '#ff4d4f', ext: VIDEO_EXT, key: 'video' },
  { icon: <AudioIcon />, color: '#ff6e31', ext: AUDIO_EXT, key: 'audio' },
  { icon: <JavaIcon />, color: '#1677ff', ext: ['java'], key: 'java' },
  { icon: <JavaScriptIcon />, color: '#fab714', ext: ['js'], key: 'javascript' },
  { icon: <PythonIcon />, color: '#fab714', ext: ['py'], key: 'python' },
];

const DEFAULT_ICON = {
  icon: <FileTextFilled />,
  color: '#8c8c8c',
};

const domProps = computed(() =>
  pickAttrs(props, {
    attr: true,
    aria: true,
    data: true,
  }),
);

const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = computed(() => getPrefixCls('file-card', props.prefixCls));
const contextConfig = useXComponentConfig('fileCard');
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

const nameParts = computed(() => {
  const nameStr = props.name || '';
  const match = nameStr.match(/^(.*)\.[^.]+$/);
  return match ? [match[1], nameStr.slice(match[1].length)] : [nameStr, ''];
});

const namePrefix = computed(() => nameParts.value[0]);
const nameSuffix = computed(() => nameParts.value[1]);

const iconMeta = computed(() => {
  const customIcon = props.icon;
  if (typeof customIcon === 'string') {
    const match = PRESET_FILE_ICONS.find((item) => item.key === customIcon);
    if (match) return [match.icon, match.color] as const;
  }
  for (const item of PRESET_FILE_ICONS) {
    if (matchExt(nameSuffix.value, item.ext)) {
      return [item.icon, item.color] as const;
    }
  }
  return [DEFAULT_ICON.icon, DEFAULT_ICON.color] as const;
});

const fileType = computed<CardType>(() => {
  if (props.type) return props.type;
  if (matchExt(nameSuffix.value, IMAGE_EXT)) return 'image';
  if (matchExt(nameSuffix.value, AUDIO_EXT)) return 'audio';
  if (matchExt(nameSuffix.value, VIDEO_EXT)) return 'video';
  return 'file';
});

const resolvedIcon = computed(() =>
  props.icon && typeof props.icon !== 'string' ? props.icon : iconMeta.value[0],
);

const cardInfo = computed<CardInfo>(() => ({
  size: typeof props.byte === 'number' ? getSize(props.byte) : '',
  icon: resolvedIcon.value,
  name: props.name,
  namePrefix: namePrefix.value,
  nameSuffix: nameSuffix.value,
  src: props.src,
  type: fileType.value,
}));

const descNode = computed(() => {
  const description = props.description;
  const descriptionNode =
    typeof description === 'function' ? description(cardInfo.value) : description;
  if (descriptionNode === false) return null;
  return descriptionNode ?? cardInfo.value.size;
});

const maskNode = computed(() => {
  const mask = props.mask;
  const maskContent = typeof mask === 'function' ? mask(cardInfo.value) : mask;
  return maskContent === false ? null : maskContent;
});

const handleClick = (event: MouseEvent) => {
  if (!props.onClick) return;
  props.onClick?.(cardInfo.value, event);
  emit('click', cardInfo.value, event);
};

const mergedCls = computed(() =>
  classnames(
    prefixCls.value,
    contextConfig.value.className,
    props.className,
    props.class,
    props.rootClassName,
    props.classNames.root,
    hashId.value,
    cssVarCls,
    {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
    },
  ),
);

defineRender(() => {
  const compFileCls = `${prefixCls.value}-file`;
  let contentNode: any = null;

  if (fileType.value === 'image') {
    contentNode = (
      <div
        class={classnames(`${prefixCls.value}-image`, props.classNames.file, {
          [`${prefixCls.value}-loading`]: props.loading,
        })}
        style={props.styles.file}
      >
        <Image
          rootClassName={classnames(`${prefixCls.value}-image-img`)}
          alt={props.name}
          src={props.src}
          {...(props.imageProps as any)}
        />
        {props.loading && (
          <div class={`${prefixCls.value}-image-loading`} style={props.styles.file}>
            <Spin />
          </div>
        )}
      </div>
    );
  } else if (fileType.value === 'video') {
    contentNode = (
      <video
        src={props.src}
        controls
        style={props.styles.file}
        class={classnames(`${prefixCls.value}-video`, props.classNames.file)}
        {...(props.videoProps as any)}
      />
    );
  } else if (fileType.value === 'audio') {
    contentNode = (
      <audio
        src={props.src}
        controls
        style={props.styles.file}
        class={classnames(`${prefixCls.value}-audio`, props.classNames.file)}
        {...(props.audioProps as any)}
      />
    );
  } else {
    contentNode = (
      <div
        class={classnames(compFileCls, props.classNames.file, {
          [`${compFileCls}-pointer`]: !!props.onClick,
          [`${compFileCls}-small`]: props.size === 'small',
        })}
        style={props.styles.file}
        onClick={handleClick}
      >
        <div
          class={classnames(`${compFileCls}-icon`, props.classNames.icon)}
          style={{ color: iconMeta.value[1], ...props.styles.icon }}
        >
          {resolvedIcon.value}
        </div>
        <div class={`${compFileCls}-content`}>
          <div
            class={classnames(`${compFileCls}-name`, props.classNames.name)}
            style={props.styles.name}
          >
            <span class={`${compFileCls}-name-prefix`}>{namePrefix.value}</span>
            <span class={`${compFileCls}-name-suffix`}>{nameSuffix.value}</span>
          </div>
          {descNode.value !== null && descNode.value !== undefined && (
            <div
              class={classnames(`${compFileCls}-description`, props.classNames.description)}
              style={props.styles.description}
            >
              {descNode.value}
            </div>
          )}
        </div>
        {maskNode.value !== null && maskNode.value !== undefined && (
          <div class={`${compFileCls}-mask`}>
            <div class={`${compFileCls}-mask-info`}>{maskNode.value}</div>
          </div>
        )}
      </div>
    );
  }

  return wrapCSSVar(
    <div
      {...domProps.value}
      class={mergedCls.value}
      style={{
        ...(typeof contextConfig.value.style === 'object' ? contextConfig.value.style : {}),
        ...(typeof props.style === 'object' ? props.style : {}),
        ...props.styles.root,
      }}
    >
      {contentNode}
    </div>,
  );
});
</script>
