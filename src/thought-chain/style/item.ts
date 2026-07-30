import type { CSSObject } from '../../_util/cssinjs';
import { unit } from '../../_util/cssinjs';
import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { ThoughtChainToken } from '.';

/**
 * ThoughtChain.Item compound styles.
 * Scoped as `${componentCls}${itemCls}` so they do not collide with
 * legacy chain-node `.ant-thought-chain-item` under size parents.
 */
const genThoughtChainCompoundItemStyle: GenerateStyle<ThoughtChainToken, CSSObject> = (
  token,
) => {
  const { componentCls, calc } = token;
  const itemCls = `${componentCls}-item`;
  const compoundCls = `${componentCls}${itemCls}`;

  return {
    [compoundCls]: {
      display: 'inline-flex',
      gap: unit(calc(token.marginXXS).add(1).equal()),
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      fontSize: token.fontSize,
      color: token.colorText,
      paddingBlock: unit(calc(token.paddingXXS).add(1).equal()),
      paddingInline: token.paddingSM,
      boxSizing: 'border-box',
      lineHeight: token.lineHeight,
      borderRadius: token.itemBorderRadius,
      alignItems: 'baseline',
      [`&${itemCls}-rtl`]: {
        direction: 'rtl',
      },
      [`&${itemCls}-click:not(${itemCls}-disabled)`]: {
        cursor: 'pointer',
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
      },
      [`&${itemCls}-disabled`]: {
        cursor: 'not-allowed',
      },
      [`${componentCls}-motion-blink`]: {
        [`${itemCls}-description`]: {
          color: token.itemMotionDescription,
        },
      },
      [`${componentCls}-status-success`]: {
        color: token.colorSuccess,
      },
      [`${componentCls}-status-loading`]: {
        color: token.colorPrimary,
      },
      [`${itemCls}-title`]: {
        display: 'inline-block',
        whiteSpace: 'nowrap',
      },
      [`${itemCls}-title-with-description`]: {
        marginInlineEnd: token.marginXS,
      },
      [`${itemCls}-description`]: {
        color: token.colorTextDescription,
        display: 'inline-block',
        whiteSpace: 'break-spaces',
      },
      [`&${itemCls}-disabled:not(${itemCls}-error)`]: {
        color: token.colorTitleDisabled,
        [`${itemCls}-description`]: {
          color: token.colorDescriptionDisabled,
        },
        [`${componentCls}-status-success`]: {
          color: token.colorSuccessDisabled,
        },
        [`${componentCls}-status-loading`]: {
          color: token.colorPrimaryDisabled,
        },
      },
      [`&${itemCls}-solid`]: {
        background: token.itemSolidBg,
        [`&${itemCls}-disabled`]: {
          background: token.colorBgContainerDisabled,
        },
        [`&${itemCls}-click:not(${itemCls}-error):hover`]: {
          background: token.itemSolidHoverBg,
        },
        [`&${itemCls}-error:not(${itemCls}-disabled)`]: {
          background: token.colorErrorBg,
        },
        [`&${itemCls}-error:where(${itemCls}-disabled)`]: {
          background: token.colorErrorBgDisabled,
        },
      },
      [`&${itemCls}-outlined`]: {
        paddingBlock: token.paddingXXS,
        backgroundColor: token.itemOutlinedBg,
        borderWidth: token.lineWidth,
        borderStyle: token.lineType,
        borderColor: token.colorBorder,
        [`&${itemCls}-error:not(${itemCls}-disabled)`]: {
          borderColor: token.colorErrorBorder,
          background: token.colorErrorBg,
        },
        [`&${itemCls}-error:where(${itemCls}-disabled)`]: {
          borderColor: token.colorErrorBorder,
          background: token.colorErrorBgDisabled,
        },
        [`&${itemCls}-click:not(${itemCls}-error):hover`]: {
          background: token.itemOutlinedHoverBg,
        },
      },
      [`&${itemCls}-text`]: {
        [`&${itemCls}-click:not(${itemCls}-error):hover`]: {
          background: token.itemSolidHoverBg,
        },
      },
      [`&${itemCls}-error`]: {
        [`&:not(${itemCls}-disabled)`]: {
          color: token.colorErrorText,
          [`${itemCls}-description`]: {
            color: token.colorErrorTextDescription,
          },
        },
        [`&:where(${itemCls}-disabled)`]: {
          color: token.colorErrorTextDisabled,
          [`${itemCls}-description`]: {
            color: token.colorErrorTextDescriptionDisabled,
          },
        },
        [`&${itemCls}-click:hover`]: {
          background: token.colorErrorBgHover,
        },
      },
    },
  };
};

export default genThoughtChainCompoundItemStyle;
