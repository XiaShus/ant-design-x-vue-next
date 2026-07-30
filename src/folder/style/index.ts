import { mergeToken } from '../../_util/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/cssinjs-utils';

export interface ComponentToken {
  /**
   * @desc 目录背景色
   * @descEN Background color of directory
   */
  colorBgDirectory: string;
}

export interface FolderToken extends FullToken<'Folder'> {}

const genFolderStyle: GenerateStyle<FolderToken> = (token) => {
  const { componentCls, antCls } = token;

  return {
    [componentCls]: {
      height: '100%',
      width: '100%',
      background: token.colorBgDirectory,
      [`${antCls}-tree-node-content-wrapper`]: {
        display: 'flex',
        paddingInline: 0,
      },
      [`${antCls}-tree-node-content-wrapper-open,${antCls}-tree-node-content-wrapper-close`]: {
        display: 'flex',
      },
      [`${antCls}-tree-node-content-wrapper-normal`]: {
        display: 'flex',
      },
      [`${antCls}-tree-list`]: {
        paddingInline: token.padding,
        paddingBlock: token.paddingXS,
      },
      [`${antCls}-tree-switcher`]: {
        width: '10px',
        '&:before': {
          width: '10px',
          height: '10px',
        },
      },
      [`${componentCls}-container`]: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
      },
      [`${componentCls}-directory-tree`]: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      },
      [`${componentCls}-directory-tree-title`]: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      },
      [`${componentCls}-directory-tree-content`]: {
        width: '100%',
        background: 'transparent',
        height: '100%',
        borderRadius: 'unset',
        display: 'flex',
        overflow: 'auto',
      },
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },
    },
  };
};

const genFilePreviewStyle: GenerateStyle<FolderToken> = (token) => {
  const { componentCls, calc } = token;

  return {
    [componentCls]: {
      [`${componentCls}-preview`]: {
        width: '100%',
        background: token.colorBgContainer,
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      },
      [`${componentCls}-preview-title`]: {
        background: token.colorBgContainer,
        paddingInline: token.padding,
        paddingBlock: token.paddingXS,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      [`${componentCls}-preview-content`]: {
        overflow: 'auto',
        flex: 1,
        background: token.colorBgContainer,
        paddingInline: token.padding,
        paddingBlock: token.paddingXS,
        [`pre`]: {
          margin: 0,
          background: 'transparent',
          fontFamily: token.fontFamilyCode,
          fontSize: token.fontSize,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        },
      },
      [`${componentCls}-preview-loading-container`]: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBlockStart: calc(token.marginLG).mul(3).equal(),
      },
      [`${componentCls}-preview-empty-container`]: {
        marginBlockStart: calc(token.marginLG).mul(3).equal(),
      },
      [`${componentCls}-directory-tree-item-title`]: {
        display: 'flex',
        whiteSpace: 'nowrap',
        paddingInlineEnd: token.padding,
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Folder'> = (token) => ({
  colorBgDirectory: token.colorFillTertiary,
});

export default genStyleHooks<'Folder'>(
  'Folder',
  (token) => {
    const compToken = mergeToken<FolderToken>(token, {});
    return [genFolderStyle(compToken), genFilePreviewStyle(compToken)];
  },
  prepareComponentToken,
);
