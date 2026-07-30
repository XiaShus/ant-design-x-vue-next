import type { ConfigProviderProps } from 'ant-design-vue';
import { FastColor } from '@ant-design/fast-color';
import { type CSSObject, Keyframes, unit } from '../../_util/cssinjs';
import { mergeToken } from '../../_util/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { genTransitionCollapseStyle } from '../../transition-collapse';
import { THOUGHT_CHAIN_ITEM_STATUS } from '../interface';
import genThoughtChainCompoundItemStyle from './item';

export interface ComponentToken {
  /**
   * @desc 实心的 ThoughtChain.Item 背景色
   * @descEN ThoughtChain.Item `solid`'s background color
   */
  itemSolidBg: string;
  /**
   * @desc 实心的 ThoughtChain.Item 悬浮态背景色
   * @descEN ThoughtChain.Item `solid`'s hover background color
   */
  itemSolidHoverBg: string;
  /**
   * @desc 边框模式的 ThoughtChain.Item 背景色
   * @descEN ThoughtChain.Item `outlined`'s background color
   */
  itemOutlinedBg: string;
  /**
   * @desc 边框模式的 ThoughtChain.Item 悬浮态背景色
   * @descEN ThoughtChain.Item `outlined`'s hover background color
   */
  itemOutlinedHoverBg: string;
  /**
   * @desc ThoughtChain.Item 圆角
   * @descEN ThoughtChain.Item's border radius
   */
  itemBorderRadius: number;
  /**
   * @desc 思维链节点描述文字的动画颜色
   * @descEN ThoughtChain node description text animation color
   */
  itemMotionDescription: string;
  /**
   * @desc 默认打字动画颜色
   * @descEN Default typing animation color
   */
  colorTextBlinkDefault: string;
  /**
   * @desc 打字动画颜色
   * @descEN Typing animation color
   */
  colorTextBlink: string;
  /**
   * @desc 错误状态描述文字颜色
   * @descEN Error state description text color
   */
  colorErrorTextDescription: string;
  /**
   * @desc 错误状态禁用文字颜色
   * @descEN Error state disabled text color
   */
  colorErrorTextDisabled: string;
  /**
   * @desc 错误状态禁用描述文字颜色
   * @descEN Error state disabled description text color
   */
  colorErrorTextDescriptionDisabled: string;
  /**
   * @desc 错误状态禁用背景色
   * @descEN Error state disabled background color
   */
  colorErrorBgDisabled: string;
  /**
   * @desc 禁用描述文字颜色
   * @descEN Disabled description text color
   */
  colorDescriptionDisabled: string;
  /**
   * @desc 禁用标题文字颜色
   * @descEN Disabled title text color
   */
  colorTitleDisabled: string;
  /**
   * @desc 成功状态禁用颜色
   * @descEN Success state disabled color
   */
  colorSuccessDisabled: string;
  /**
   * @desc 主要状态禁用颜色
   * @descEN Primary state disabled color
   */
  colorPrimaryDisabled: string;
}

export interface ThoughtChainToken extends FullToken<'ThoughtChain'> {
  /**
   * @desc default size for item font size
   */
  itemFontSize: number;
  /**
   * @desc default size for item
   */
  itemSize: number;
  /**
   * @desc gap between items
   */
  itemGap: number;
  /**
   * @desc large size for item font size
   */
  itemFontSizeLG: number;
  /**
   * @desc large size for item
   */
  itemSizeLG: number;
  /**
   * @desc large gap between items
   */
  itemGapLG: number;
  /**
   * @desc small size for item font size
   */
  itemFontSizeSM: number;
  /**
   * @desc small size for item
   */
  itemSizeSM: number;
  /**
   * @desc small gap between items
   */
  itemGapSM: number;
}

type GenerateThoughtChainItemStyle = GenerateStyle<
  ThoughtChainToken,
  CSSObject
>;

const blink = new Keyframes('antXThoughtChainBlink', {
  '0%': {
    backgroundPositionX: '-200%',
    backgroundPositionY: '100%',
  },
  '25%': {
    backgroundPositionX: '-100%',
    backgroundPositionY: '100%',
  },
  '50%': {
    backgroundPositionX: '0%',
    backgroundPositionY: '100%',
  },
  '75%': {
    backgroundPositionX: '100%',
    backgroundPositionY: '100%',
  },
  '100%': {
    backgroundPositionX: '200%',
    backgroundPositionY: '100%',
  },
});

const genThoughtChainItemStatusStyle: GenerateThoughtChainItemStyle = (
  token,
) => {
  const { componentCls } = token;
  const itemCls = `${componentCls}-item`;

  const colors = {
    [THOUGHT_CHAIN_ITEM_STATUS.LOADING]: token.colorPrimaryText,
    [THOUGHT_CHAIN_ITEM_STATUS.SUCCESS]: token.colorSuccessText,
    [THOUGHT_CHAIN_ITEM_STATUS.ERROR]: token.colorErrorText,
    [THOUGHT_CHAIN_ITEM_STATUS.ABORT]: token.colorTextSecondary,
    // deprecated alias of loading
    [THOUGHT_CHAIN_ITEM_STATUS.PENDING]: token.colorPrimaryText,
  };

  const statuses = Object.keys(colors) as (keyof typeof colors)[];

  return statuses.reduce((acc, status) => {
    const statusColor = colors[status];

    statuses.forEach((nextStatus) => {
      const itemStatusCls = `& ${itemCls}-${status}-${nextStatus}`;
      const lastBeforePseudoStyle =
        status === nextStatus
          ? {}
          : {
              backgroundColor: 'none !important',
              backgroundImage: `linear-gradient(${statusColor}, ${colors[nextStatus]})`,
            };

      acc[itemStatusCls] = {
        [`& ${itemCls}-icon, & > *::before`]: {
          backgroundColor: `${statusColor} !important`,
        },
        '& > :last-child::before': lastBeforePseudoStyle,
      };
    });

    return acc;
  }, {} as CSSObject);
};

const genThoughtChainItemBeforePseudoStyle: GenerateThoughtChainItemStyle = (
  token,
) => {
  const { calc, componentCls } = token;
  const itemCls = `${componentCls}-item`;

  const beforePseudoBaseStyle = {
    content: '""',
    width: calc(token.lineWidth).mul(2).equal(),
    display: 'block',
    position: 'absolute',
    insetInlineEnd: 'none',
    backgroundColor: token.colorTextPlaceholder,
  };

  return {
    '& > :last-child > :last-child': {
      '&::before': {
        display: 'none !important',
      },
      [`&${itemCls}-footer`]: {
        '&::before': {
          display: 'block !important',
          bottom: 0,
        },
      },
    },
    [`& > ${itemCls}`]: {
      [`& ${itemCls}-header, & ${itemCls}-content, & ${itemCls}-footer`]: {
        position: 'relative',

        '&::before': {
          bottom: calc(token.itemGap).mul(-1).equal(),
        },
      },
      [`& ${itemCls}-header, & ${itemCls}-content`]: {
        marginInlineStart: calc(token.itemSize).mul(-1).equal(),

        '&::before': {
          ...beforePseudoBaseStyle,
          insetInlineStart: calc(token.itemSize)
            .div(2)
            .sub(token.lineWidth)
            .equal(),
        },
      },
      [`& ${itemCls}-header::before`]: {
        top: token.itemSize,
        bottom: calc(token.itemGap).mul(-2).equal(),
      },
      [`& ${itemCls}-content::before`]: {
        top: '100%',
      },
      [`& ${itemCls}-footer::before`]: {
        ...beforePseudoBaseStyle,
        top: 0,
        insetInlineStart: calc(token.itemSize)
          .div(-2)
          .sub(token.lineWidth)
          .equal(),
      },
    },
  } as CSSObject;
};

const genThoughtChainItemStyle: GenerateThoughtChainItemStyle = (token) => {
  const { componentCls } = token;
  const itemCls = `${componentCls}-item`;

  return {
    [itemCls]: {
      display: 'flex',
      flexDirection: 'column',

      [`& ${itemCls}-collapsible`]: {
        cursor: 'pointer',
      },
      [`& ${itemCls}-header`]: {
        display: 'flex',
        marginBottom: token.itemGap,
        gap: token.itemGap,
        alignItems: 'flex-start',

        [`& ${itemCls}-icon`]: {
          height: token.itemSize,
          width: token.itemSize,
          fontSize: token.itemFontSize,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        [`& ${itemCls}-extra`]: {
          height: token.itemSize,
          maxHeight: token.itemSize,
        },
        [`& ${itemCls}-header-box`]: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',

          [`& ${itemCls}-title`]: {
            height: token.itemSize,
            lineHeight: `${unit(token.itemSize)}`,
            maxHeight: token.itemSize,
            fontSize: token.itemFontSize,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',

            [`& ${itemCls}-collapse-icon`]: {
              marginInlineEnd: token.marginXS,
            },
          },
          [`& ${itemCls}-desc`]: {
            fontSize: token.itemFontSize,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
      },
      [`& ${itemCls}-content`]: {
        [`& ${itemCls}-content-hidden`]: {
          display: 'none',
        },
        [`& ${itemCls}-content-box`]: {
          padding: token.itemGap,
          display: 'inline-block',
          maxWidth: `calc(100% - ${token.itemSize})`,
          borderRadius: token.borderRadiusLG,
          backgroundColor: token.colorBgContainer,
          border: `${unit(token.lineWidth)} ${token.lineType} ${
            token.colorBorderSecondary
          }`,
        },
      },
      [`& ${itemCls}-footer`]: {
        marginTop: token.itemGap,
        display: 'inline-flex',
      },
    },
  };
};

const genThoughtChainSizeStyle = (
  token: ThoughtChainToken,
  size: ConfigProviderProps['componentSize'] = 'middle',
) => {
  const { componentCls } = token;

  const sizeTokens = {
    large: {
      itemSize: token.itemSizeLG,
      itemGap: token.itemGapLG,
      itemFontSize: token.itemFontSizeLG,
    },
    middle: {
      itemSize: token.itemSize,
      itemGap: token.itemGap,
      itemFontSize: token.itemFontSize,
    },
    small: {
      itemSize: token.itemSizeSM,
      itemGap: token.itemGapSM,
      itemFontSize: token.itemFontSizeSM,
    },
  }[size];

  return {
    [`&${componentCls}-${size}`]: {
      paddingInlineStart: sizeTokens.itemSize,
      gap: sizeTokens.itemGap,

      ...genThoughtChainItemStyle({
        ...token,
        ...sizeTokens,
      }),
      ...genThoughtChainItemBeforePseudoStyle({
        ...token,
        ...sizeTokens,
      }),
    },
  };
};

const genThoughtChainLineStyle: GenerateThoughtChainItemStyle = (token) => {
  const { calc, componentCls } = token;
  const itemCls = `${componentCls}-item`;
  const lineWidth = calc(token.lineWidth).mul(2).equal();

  const linePseudoReset: CSSObject = {
    width: 0,
    backgroundColor: 'transparent !important',
    backgroundImage: 'none !important',
  };

  return {
    [`&${componentCls}-line-false`]: {
      [`& > ${itemCls}`]: {
        [`& ${itemCls}-header, & ${itemCls}-content, & ${itemCls}-footer`]: {
          '&::before': {
            display: 'none !important',
          },
        },
      },
    },
    [`&${componentCls}-line-dashed`]: {
      [`& > ${itemCls}`]: {
        [`& ${itemCls}-header::before, & ${itemCls}-content::before, & ${itemCls}-footer::before`]:
          {
            ...linePseudoReset,
            borderInlineStart: `${unit(lineWidth)} dashed ${token.colorTextPlaceholder}`,
          },
      },
    },
    [`&${componentCls}-line-dotted`]: {
      [`& > ${itemCls}`]: {
        [`& ${itemCls}-header::before, & ${itemCls}-content::before, & ${itemCls}-footer::before`]:
          {
            ...linePseudoReset,
            borderInlineStart: `${unit(lineWidth)} dotted ${token.colorTextPlaceholder}`,
          },
      },
    },
  };
};

const genThoughtChainStyle: GenerateStyle<ThoughtChainToken> = (token) => {
  const { componentCls } = token;

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',

      ...genThoughtChainItemStatusStyle(token),
      ...genThoughtChainSizeStyle(token),
      ...genThoughtChainSizeStyle(token, 'large'),
      ...genThoughtChainSizeStyle(token, 'small'),
      ...genThoughtChainLineStyle(token),

      [`${componentCls}-motion-blink`]: {
        backgroundClip: 'text',
        color: token.colorTextBlinkDefault,
        WebkitBackgroundClip: 'text',
        backgroundImage: `linear-gradient(90deg,transparent,${token.colorTextBlink},transparent)`,
        animationDuration: '1s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
        animationFillMode: 'forwards',
        backgroundSize: '50%',
        backgroundRepeat: 'no-repeat',
        animationName: blink,
      },

      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'ThoughtChain'> = (token) => {
  const itemMotionDescription = new FastColor(token.colorTextDescription)
    .setA(0.25)
    .toRgbString();
  const colorTextBlinkDefault = token.colorTextDescription;
  const colorTextBlink = token.colorTextBase;
  const colorErrorTextDescription = new FastColor(token.colorErrorText)
    .setA(0.45)
    .toRgbString();
  const colorErrorTextDisabled = new FastColor(token.colorErrorText)
    .setA(0.45)
    .toRgbString();
  const itemSolidHoverBg = new FastColor(token.colorFillTertiary)
    .setA(0.06)
    .toRgbString();
  const colorErrorTextDescriptionDisabled = new FastColor(token.colorErrorText)
    .setA(0.25)
    .toRgbString();
  const colorDescriptionDisabled = new FastColor(token.colorTextDescription)
    .setA(0.25)
    .toRgbString();
  const colorTitleDisabled = new FastColor(token.colorText).setA(0.45).toRgbString();
  const colorErrorBgDisabled = new FastColor(token.colorErrorBg)
    .setA(0.25)
    .toRgbString();
  const itemOutlinedHoverBg = itemSolidHoverBg;
  const colorSuccessDisabled = new FastColor(token.colorSuccess)
    .setA(0.45)
    .toRgbString();
  const colorPrimaryDisabled = new FastColor(token.colorPrimary)
    .setA(0.45)
    .toRgbString();

  return {
    colorDescriptionDisabled,
    colorPrimaryDisabled,
    colorSuccessDisabled,
    colorTitleDisabled,
    colorErrorTextDisabled,
    colorErrorBgDisabled,
    colorErrorTextDescriptionDisabled,
    itemMotionDescription,
    colorTextBlinkDefault,
    colorTextBlink,
    itemSolidBg: token.colorFillTertiary,
    itemSolidHoverBg,
    itemOutlinedBg: token.colorBgContainer,
    itemOutlinedHoverBg,
    itemBorderRadius: token.borderRadius,
    colorErrorTextDescription,
  };
};

export default genStyleHooks(
  'ThoughtChain',
  (token) => {
    const compToken = mergeToken<ThoughtChainToken>(token, {
      // small size tokens
      itemFontSizeSM: token.fontSizeSM,
      itemSizeSM: token
        .calc(token.controlHeightXS)
        .add(token.controlHeightSM)
        .div(2)
        .equal() as number,
      itemGapSM: token.marginSM,
      // default size tokens
      itemFontSize: token.fontSize,
      itemSize: token
        .calc(token.controlHeightSM)
        .add(token.controlHeight)
        .div(2)
        .equal() as number,
      itemGap: token.margin,
      // large size tokens
      itemFontSizeLG: token.fontSizeLG,
      itemSizeLG: token
        .calc(token.controlHeight)
        .add(token.controlHeightLG)
        .div(2)
        .equal() as number,
      itemGapLG: token.marginLG,
    });
    return [
      blink,
      genThoughtChainStyle(compToken),
      genThoughtChainCompoundItemStyle(compToken),
      genTransitionCollapseStyle(compToken),
    ];
  },
  prepareComponentToken,
);
