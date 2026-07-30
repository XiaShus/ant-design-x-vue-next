<script setup lang="tsx">
import { AudioMutedOutlined } from '@ant-design/icons-vue';
import classnames from 'classnames';
import type { CSSProperties } from 'vue';
import { computed, h, useAttrs } from 'vue';
import { useXProviderContext } from '../x-provider';
import RecordingIcon from '../sender/components/SpeechButton/RecordingIcon.vue';
import ActionsItem from './ActionsItem.vue';
import { ACTIONS_ITEM_STATUS } from './constants';
import useLocale from '../locale/useLocale';
import type { ActionsAudioProps } from './preset-types';
import useStyle from './style';

defineOptions({ name: 'AXActionsAudio', inheritAttrs: false });

const props = withDefaults(defineProps<ActionsAudioProps>(), {
  status: ACTIONS_ITEM_STATUS.DEFAULT,
  prefixCls: undefined,
  rootClassName: '',
  classNames: () => ({}),
  styles: () => ({}),
});

const attrs = useAttrs();
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('actions', props.prefixCls);
const [, hashId, cssVarCls] = useStyle(prefixCls);
const audioCls = `${prefixCls}-audio`;
const [locale] = useLocale('Actions');

const statusLabel = computed<Record<string, string>>(() => ({
  [ACTIONS_ITEM_STATUS.LOADING]: locale.value.audioLoading,
  [ACTIONS_ITEM_STATUS.ERROR]: locale.value.audioError,
  [ACTIONS_ITEM_STATUS.RUNNING]: locale.value.audioRunning,
  [ACTIONS_ITEM_STATUS.DEFAULT]: locale.value.audio,
}));

const mergedRootClass = computed(() =>
  classnames(
    prefixCls,
    audioCls,
    hashId.value,
    cssVarCls,
    props.rootClassName,
    attrs.class as string,
    props.classNames?.root,
    {
      [`${audioCls}-rtl`]: direction.value === 'rtl',
      [`${audioCls}-${props.status}`]: props.status,
    },
  ),
);

defineRender(() => {
  const { class: _c, ...restAttrs } = attrs as Record<string, any>;
  return (
    <ActionsItem
      {...restAttrs}
      label={props.status ? statusLabel.value[props.status] : ''}
      style={attrs.style as CSSProperties}
      styles={props.styles}
      classNames={{
        ...props.classNames,
        root: mergedRootClass.value,
      }}
      status={props.status}
      defaultIcon={<AudioMutedOutlined />}
      runningIcon={h(RecordingIcon, { className: `${audioCls}-recording-icon` })}
    />
  );
});
</script>
