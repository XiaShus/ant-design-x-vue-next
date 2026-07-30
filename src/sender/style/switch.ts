import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { SenderToken } from '.';

const genSenderSwitchStyle: GenerateStyle<SenderToken> = (token) => {
  const { componentCls, antCls } = token;
  const switchCls = `${componentCls}-switch`;

  return {
    [componentCls]: {
      [`&${switchCls}-rtl`]: {
        direction: 'rtl',
      },
      [`&${switchCls}`]: {
        display: 'inline-block',
        [`${antCls}-btn:not(:disabled):not(${antCls}-btn-disabled):hover`]: {
          background: token.colorFillSecondary,
          borderColor: token.colorBorder,
          color: token.colorText,
        },
        [`&${switchCls}-checked`]: {
          [`${antCls}-btn:not(:disabled):not(${antCls}-btn-disabled):hover`]: {
            background: token.colorPrimaryBgHover,
            borderColor: token.colorPrimary,
            color: token.colorPrimary,
          },
          [`${switchCls}-content`]: {
            background: token.colorPrimaryBg,
          },
        },
      },
    },
  };
};

export default genSenderSwitchStyle;
