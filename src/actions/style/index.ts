import { mergeToken } from '../../_util/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface ActionsToken extends FullToken<'Actions'> {}

const genActionsStyle: GenerateStyle<ActionsToken> = (token) => {
  const { componentCls, calc } = token;

  return {
    [componentCls]: {
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      [`${componentCls}-list`]: {
        display: 'inline-flex',
        flexDirection: 'row',
        gap: token.paddingXS,
        color: token.colorTextDescription,

        '&-item, &-sub-item': {
          cursor: 'pointer',
          padding: token.paddingXXS,
          borderRadius: token.borderRadius,
          height: token.controlHeightSM,
          width: token.controlHeightSM,
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',

          '&-icon': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: token.fontSize,
            width: '100%',
            height: '100%',
          },

          '&:hover': {
            background: token.colorBgTextHover,
          },

          '&-disabled': {
            cursor: 'not-allowed',
            opacity: 0.4,
            pointerEvents: 'none',

            '&:hover': {
              background: 'transparent',
            },
          },
        },
      },
      '& .border': {
        padding: `${token.paddingXS}px ${token.paddingSM}px`,
        gap: token.paddingSM,
        borderRadius: calc(token.borderRadiusLG).mul(1.5).equal(),
        backgroundColor: token.colorBorderSecondary,
        color: token.colorTextSecondary,

        [`${componentCls}-list-item, ${componentCls}-list-sub-item`]: {
          padding: 0,
          lineHeight: token.lineHeight,

          '&-icon': {
            fontSize: token.fontSizeLG,
          },

          '&:hover': {
            opacity: 0.8,
          },
        },
      },
      '& .block': {
        display: 'flex',
      },

      // Preset: Copy (Typography.Text copyable)
      [`${componentCls}-copy`]: {
        [`&${componentCls}-copy-rtl`]: {
          direction: 'rtl',
        },
        [`${componentCls}-copy-copy`]: {
          fontSize: 'inherit',
          [`&:not(${componentCls}-copy-success)`]: {
            color: 'inherit !important',
          },
        },
      },

      // Preset: Feedback
      [`&${componentCls}-feedback, ${componentCls}-feedback`]: {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: token.paddingXXS,
      },

      // Preset: Item / Audio button
      [`&${componentCls}-button-item, ${componentCls}-button-item, &${componentCls}-item, ${componentCls}-item`]:
        {
          cursor: 'pointer',
          fontSize: token.fontSize,
          paddingInline: token.paddingXXS,
          paddingBlock: token.paddingXXS,
          borderRadius: token.borderRadiusSM,
          height: token.controlHeightSM,
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: token.lineHeight,
          touchAction: 'manipulation',
          '&:hover': {
            background: token.colorBgTextHover,
          },
        },

      [`${componentCls}-audio-recording-icon`]: {
        width: '1em',
        height: '1em',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Actions'> = () => ({});

export default genStyleHooks(
  'Actions',
  (token) => {
    const compToken = mergeToken<ActionsToken>(token, {});
    return [genActionsStyle(compToken)];
  },
  prepareComponentToken,
);

