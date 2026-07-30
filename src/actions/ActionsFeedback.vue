<script setup lang="tsx">
import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
} from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';
import classnames from 'classnames';
import type { CSSProperties } from 'vue';
import { computed, useAttrs } from 'vue';
import { useMobile } from '../_util/hooks/use-mobile';
import { useXProviderContext } from '../x-provider';
import { FEEDBACK_VALUE } from './constants';
import useLocale from '../locale/useLocale';
import type { ActionsFeedbackProps } from './preset-types';
import useStyle from './style';

defineOptions({ name: 'AXActionsFeedback', inheritAttrs: false });

const props = withDefaults(defineProps<ActionsFeedbackProps>(), {
  value: 'default',
  prefixCls: undefined,
  rootClassName: '',
  classNames: () => ({}),
  styles: () => ({}),
});

const emit = defineEmits<{
  change: [value: `${FEEDBACK_VALUE}`];
}>();

const attrs = useAttrs();
const isMobile = useMobile();
const { direction, getPrefixCls } = useXProviderContext();
const prefixCls = getPrefixCls('actions', props.prefixCls);
const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);
const feedbackCls = `${prefixCls}-feedback`;
const [locale] = useLocale('Actions');

const mergedCls = computed(() =>
  classnames(
    prefixCls,
    feedbackCls,
    hashId.value,
    cssVarCls,
    props.rootClassName,
    props.classNames?.root,
    `${prefixCls}-list`,
    attrs.class as string,
    {
      [`${feedbackCls}-rtl`]: direction.value === 'rtl',
    },
  ),
);

const onDislikeClick = () => {
  emit(
    'change',
    props.value === FEEDBACK_VALUE.dislike ? FEEDBACK_VALUE.default : FEEDBACK_VALUE.dislike,
  );
};

const onLikeClick = () => {
  emit(
    'change',
    props.value === FEEDBACK_VALUE.like ? FEEDBACK_VALUE.default : FEEDBACK_VALUE.like,
  );
};

defineRender(() => {
  const value = props.value as FEEDBACK_VALUE;
  const likeIcon = value === FEEDBACK_VALUE.like ? <LikeFilled /> : <LikeOutlined />;
  const likeNode = (
    <span
      onClick={onLikeClick}
      style={{
        ...props.styles?.like,
        ...(value === 'like' ? props.styles?.liked : {}),
      }}
      class={classnames(
        `${feedbackCls}-item`,
        `${prefixCls}-item`,
        `${feedbackCls}-item-like`,
        props.classNames?.like,
        {
          [`${props.classNames?.liked}`]: props.classNames?.liked && value === 'like',
          [`${feedbackCls}-item-like-active`]: value === 'like',
        },
      )}
    >
      {likeIcon}
    </span>
  );

  const dislikeIcon = value === FEEDBACK_VALUE.dislike ? <DislikeFilled /> : <DislikeOutlined />;
  const dislikeNode = (
    <span
      onClick={onDislikeClick}
      style={{
        ...props.styles?.dislike,
        ...(value === 'dislike' ? props.styles?.disliked : {}),
      }}
      class={classnames(
        `${feedbackCls}-item`,
        `${prefixCls}-item`,
        `${feedbackCls}-item-dislike`,
        props.classNames?.dislike,
        {
          [`${props.classNames?.disliked}`]: props.classNames?.disliked && value === 'dislike',
          [`${feedbackCls}-item-dislike-active`]: value === 'dislike',
        },
      )}
    >
      {dislikeIcon}
    </span>
  );

  const showLike = [FEEDBACK_VALUE.default, FEEDBACK_VALUE.like].includes(value);
  const showDislike = [FEEDBACK_VALUE.default, FEEDBACK_VALUE.dislike].includes(value);
  const { class: _c, style: attrStyle, ...restAttrs } = attrs as Record<string, any>;

  return wrapCSSVar(
    <div
      {...restAttrs}
      class={mergedCls.value}
      style={{ ...(attrStyle as CSSProperties), ...props.styles?.root }}
    >
      {showLike
        ? isMobile.value
          ? likeNode
          : (
              <Tooltip key={`like_${value}`} title={locale.value.feedbackLike}>
                {likeNode}
              </Tooltip>
            )
        : null}
      {showDislike
        ? isMobile.value
          ? dislikeNode
          : (
              <Tooltip key={`dislike_${value}`} title={locale.value.feedbackDislike}>
                {dislikeNode}
              </Tooltip>
            )
        : null}
    </div>,
  );
});
</script>
