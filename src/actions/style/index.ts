import { unit } from '../../_util/cssinjs';
import { mergeToken } from '../../_util/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { initFadeLeftMotion, initFadeMotion } from '../../style';

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
        alignItems: 'center',
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

      [`${componentCls}-variant-outlined`]: {
        paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
        paddingBlock: token.paddingXXS,
        borderRadius: token.borderRadius,
        border: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
      },

      [`${componentCls}-variant-filled`]: {
        paddingInline: unit(calc(token.paddingXXS).add(1).equal()),
        paddingBlock: token.paddingXXS,
        borderRadius: token.borderRadius,
        backgroundColor: token.colorBorderSecondary,
        color: token.colorTextSecondary,

        [`${componentCls}-list-item, ${componentCls}-list-sub-item`]: {
          '&:hover': {
            color: token.colorTextSecondary,
            background: 'transparent',
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
    return [
      genActionsStyle(compToken),
      initFadeLeftMotion(compToken, true),
      initFadeMotion(compToken, true),
    ];
  },
  prepareComponentToken,
);

