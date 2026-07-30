import { Keyframes } from '../../_util/cssinjs';
import { mergeToken } from '../../_util/cssinjs-utils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { genTransitionCollapseStyle } from '../../transition-collapse';

export interface ComponentToken {
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
}

export interface ThinkToken extends FullToken<'Think'> {}

const blink = new Keyframes('antXBlink', {
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

const genThinkStyle: GenerateStyle<ThinkToken> = (token) => {
  const {
    componentCls,
    paddingXS,
    paddingSM,
    marginSM,
    colorTextSecondary,
    colorTextDescription,
    fontSize,
    fontSizeHeading5,
    fontSizeSM,
    lineHeight,
    colorBorder,
    lineWidth,
    calc,
  } = token;

  return {
    [componentCls]: {
      [`${componentCls}-status-wrapper`]: {
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
        gap: paddingXS,
        alignItems: 'center',
        fontSize,
        color: colorTextSecondary,
        lineHeight,
        cursor: 'pointer',
      },
      [`${componentCls}-status-icon`]: {
        fontSize: fontSizeHeading5,
        display: 'flex',
      },
      [`${componentCls}-status-text`]: {
        lineHeight,
        fontSize,
      },
      [`${componentCls}-status-down-icon`]: {
        fontSize: fontSizeSM,
        svg: {
          transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
        },
      },
      [`${componentCls}-content`]: {
        marginTop: marginSM,
        width: '100%',
        color: colorTextDescription,
        paddingInlineStart: paddingSM,
        borderInlineStart: `${calc(lineWidth).mul(2).equal()} solid ${colorBorder}`,
      },
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

export const prepareComponentToken: GetDefaultToken<'Think'> = (token) => {
  const { colorTextDescription, colorTextBase } = token;
  return {
    colorTextBlinkDefault: colorTextDescription,
    colorTextBlink: colorTextBase,
  };
};

export default genStyleHooks(
  'Think',
  (token) => {
    const compToken = mergeToken<ThinkToken>(token, {});
    return [
      blink,
      genThinkStyle(compToken),
      genTransitionCollapseStyle(compToken),
    ];
  },
  prepareComponentToken,
);
