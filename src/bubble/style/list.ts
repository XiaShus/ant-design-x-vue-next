import type { GenerateStyle } from '../../theme/cssinjs-utils';
import type { BubbleToken } from '.';

const genBubbleListStyle: GenerateStyle<BubbleToken> = (token) => {
  const { componentCls, padding } = token;
  return {
    [`${componentCls}-list`]: {
      maxHeight: '100%',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: padding,

      [`& ${componentCls}`]: {
        width: '100%',
        boxSizing: 'border-box',
      },

      [`${componentCls}-list-scroll-box`]: {
        overflowY: 'auto',
        display: 'flex',
        width: '100%',
        maxHeight: '100%',
        flex: 1,
        flexDirection: 'column',
        gap: padding,
        scrollbarWidth: 'thin',
        scrollbarColor: `${token.colorTextTertiary} transparent`,
        '&::-webkit-scrollbar': {
          width: 8,
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: token.colorTextTertiary,
          borderRadius: token.borderRadiusSM,
        },
      },

      [`${componentCls}-list-scroll-content`]: {
        display: 'flex',
        width: '100%',
        height: 'fit-content',
        flexDirection: 'column',
        boxSizing: 'border-box',
        gap: padding,
      },
    },
  };
};

export default genBubbleListStyle;
