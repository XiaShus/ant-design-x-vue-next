import { FastColor } from '@ant-design/fast-color';
import { unit } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { mergeToken } from '../../_util/cssinjs-utils';

export interface ComponentToken {
  creationBgColor?: string;
  creationBorderColor?: string;
  creationHoverColor?: string;
}

export interface ConversationsToken extends FullToken<'Conversations'> {
  creationBgColor: string;
  creationBorderColor: string;
  creationHoverColor: string;
}

const genConversationsStyle: GenerateStyle<ConversationsToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingXXS,
      overflowY: 'auto',
      padding: token.paddingSM,
      margin: 0,
      listStyle: 'none',

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      [`${componentCls}-creation`]: {
        backgroundColor: token.creationBgColor,
        color: token.colorPrimary,
        border: 'none',
        fontWeight: 500,
        paddingBlock: token.paddingXS,
        paddingInline: token.paddingSM,
        fontSize: token.fontSize,
        cursor: 'pointer',
        display: 'flex',
        touchAction: 'manipulation',
        gap: token.paddingXS,
        marginBlockEnd: token.marginSM,
        lineHeight: token.lineHeight,
        borderRadius: token.borderRadiusLG,
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        width: '100%',
        boxSizing: 'border-box',
        alignItems: 'center',
        [`&:not(${componentCls}-creation-disabled):hover`]: {
          color: token.colorPrimary,
          background: token.creationHoverColor,
        },
        [`&:not(${componentCls}-creation-disabled)`]: {
          border: `${unit(token.lineWidth)} ${token.lineType} ${token.creationBorderColor}`,
        },
        '&-start': { justifyContent: 'flex-start' },
        '&-center': { justifyContent: 'center' },
        '&-end': { justifyContent: 'flex-end' },
        '&-label': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: token.paddingXS,
          flex: 1,
        },
        '&-shortcut-keys': {
          display: 'inline-flex',
          gap: token.paddingXXS,
          marginInlineStart: 'auto',
          opacity: 0.75,
          fontSize: token.fontSizeSM,
          fontWeight: 400,
        },
        '&-shortcut-key': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: token.fontSizeSM,
          paddingInline: token.paddingXXS,
          borderRadius: token.borderRadiusSM,
          background: token.colorFillSecondary,
          lineHeight: 1.2,
        },
        '&-disabled': {
          cursor: 'not-allowed',
          background: token.colorBgContainerDisabled,
          [`& ${componentCls}-creation-label, ${componentCls}-creation-icon`]: {
            color: token.colorTextDisabled,
          },
        },
      },
      // 会话列表
      [`& ${componentCls}-list`]: {
        display: 'flex',
        gap: token.paddingXXS,
        flexDirection: 'column',
        paddingLeft: 0,

        [`& ${componentCls}-item`]: {
          paddingInlineStart: token.paddingXL,
        },
        [`& ${componentCls}-label`]: {
          color: token.colorTextDescription,
        },
      },
      // 会话列表项
      [`& ${componentCls}-item`]: {
        display: 'flex',
        height: token.controlHeightLG,
        minHeight: token.controlHeightLG,
        gap: token.paddingXS,
        padding: `0 ${unit(token.paddingXS)}`,
        alignItems: 'center',
        borderRadius: token.borderRadiusLG,
        cursor: 'pointer',
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        // 悬浮样式
        '&:hover': {
          backgroundColor: token.colorBgTextHover,
        },
        // 选中样式
        '&-active': {
          backgroundColor: token.colorBgTextHover,
          [`& ${componentCls}-label, ${componentCls}-menu-icon`]: {
            color: token.colorText,
          },
        },
        // 禁用样式
        '&-disabled': {
          cursor: 'not-allowed',
          [`& ${componentCls}-label`]: {
            color: token.colorTextDisabled,
          },
        },
        // 悬浮、选中时激活操作菜单
        '&:hover, &-active': {
          [`& ${componentCls}-menu-icon`]: {
            opacity: 1,
          },
        },
        // 移动端始终显示菜单图标（对齐 React useMobile）
        '&-menu-always': {
          [`& ${componentCls}-menu-icon`]: {
            opacity: 1,
          },
        },
      },
      // 会话名
      [`& ${componentCls}-label`]: {
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: token.colorText,
      },
      // 会话操作菜单
      [`& ${componentCls}-menu-icon`]: {
        opacity: 0,
        fontSize: token.fontSizeXL,
      },
      // 分组标题
      [`& ${componentCls}-group-title`]: {
        display: 'flex',
        alignItems: 'center',
        color: token.colorTextDescription,
        height: token.controlHeightLG,
        minHeight: token.controlHeightLG,
        padding: `0 ${unit(token.paddingXS)}`,
      },
      [`& ${componentCls}-group-title-collapsible`]: {
        justifyContent: 'space-between',
        cursor: 'pointer',
        color: token.colorText,
        borderRadius: token.borderRadiusLG,
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        touchAction: 'manipulation',
        '&:hover': {
          backgroundColor: token.colorBgTextHover,
        },
      },
      [`& ${componentCls}-group-label`]: {
        flex: 1,
        minWidth: 0,
      },
      [`& ${componentCls}-group-collapse-trigger`]: {
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        transform: 'rotate(0deg)',
        transformOrigin: 'center center',
      },
      [`& ${componentCls}-group-collapse-trigger-open`]: {
        transform: 'rotate(90deg)',
      },
      [`& ${componentCls}-group-collapse-trigger-close`]: {
        transform: 'rotate(0deg)',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Conversations'> = (token) => {
  const creationBgColor = new FastColor(token.colorPrimary).setA(0.15);
  const creationBorderColor = new FastColor(token.colorPrimary).setA(0.22);
  const creationHoverColor = new FastColor(token.colorPrimary).setA(0.25);
  return {
    creationBgColor: creationBgColor.toRgbString(),
    creationBorderColor: creationBorderColor.toRgbString(),
    creationHoverColor: creationHoverColor.toRgbString(),
  };
};

export default genStyleHooks(
  'Conversations',
  (token) => {
    const compToken = mergeToken<ConversationsToken>(token, {});
    return genConversationsStyle(compToken);
  },
  prepareComponentToken,
);
