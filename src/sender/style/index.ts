import { unit } from '../../_util/cssinjs';
import { mergeToken } from '../../_util/cssinjs-utils';
import { FastColor } from '@ant-design/fast-color';
import type {
  FullToken,
  GenerateStyle,
  GetDefaultToken,
} from '../../theme/cssinjs-utils';
import { genStyleHooks } from '../../theme/genStyleUtils';
import { genTransitionCollapseStyle } from '../../transition-collapse';
import genSenderHeaderStyle from './header';
import genSenderSwitchStyle from './switch';
import genSlotTextAreaStyle from './slot-textarea';

export interface ComponentToken {
  colorBgSlot?: string;
  colorTextSlot?: string;
  colorTextSlotPlaceholder?: string;
  colorBorderSlot?: string;
  colorBorderSlotHover?: string;
  colorBgSkill?: string;
  colorBgSkillHover?: string;
}

export interface SenderToken extends FullToken<'Sender'> {
  SenderContentMaxWidth: number | string;
  colorBgSlot: string;
  colorTextSlot: string;
  colorTextSlotPlaceholder: string;
  colorBorderSlot: string;
  colorBorderSlotHover: string;
  colorBgSkill: string;
  colorBgSkillHover: string;
}

const genSenderStyle: GenerateStyle<SenderToken> = (token) => {
  const {
    componentCls,
    padding,
    paddingSM,
    paddingXS,
    paddingXXS,
    lineWidth,
    lineWidthBold,
    calc,
  } = token;

  return {
    [componentCls]: {
      position: 'relative',
      width: '100%',

      boxSizing: 'border-box',
      boxShadow: `${token.boxShadowTertiary}`,
      transition: `background ${token.motionDurationSlow}`,

      // Border
      borderRadius: {
        _skip_check_: true,
        value: calc(token.borderRadius).mul(2).equal(),
      },
      borderColor: token.colorBorder,
      borderWidth: 0,
      borderStyle: 'solid',

      // Border
      '&:after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        transition: `border-color ${token.motionDurationSlow}`,

        borderRadius: {
          _skip_check_: true,
          value: 'inherit',
        },
        borderStyle: 'inherit',
        borderColor: 'inherit',
        borderWidth: lineWidth,
      },

      // Focus
      '&:focus-within': {
        boxShadow: `${token.boxShadowSecondary}`,
        borderColor: token.colorPrimary,

        '&:after': {
          borderWidth: lineWidthBold,
        },
      },

      '&-disabled': {
        background: token.colorBgContainerDisabled,
      },

      // ============================== RTL ==============================
      [`&${componentCls}-rtl`]: {
        direction: 'rtl',
      },

      // ============================ Content ============================
      [`${componentCls}-content`]: {
        display: 'flex',
        gap: paddingXS,
        width: '100%',

        paddingBlock: paddingSM,
        paddingInlineStart: padding,
        paddingInlineEnd: paddingSM,
        boxSizing: 'border-box',
        alignItems: 'flex-end',
      },

      // ============================ Prefix =============================
      [`${componentCls}-prefix`]: {
        flex: 'none',
      },

      // ============================= Input =============================
      [`${componentCls}-input`]: {
        padding: 0,
        borderRadius: 0,
        flex: 'auto',
        alignSelf: 'center',
        minHeight: 'auto',
      },

      // ============================ Actions ============================
      [`${componentCls}-actions-list`]: {
        flex: 'none',
        display: 'flex',

        '&-presets': {
          gap: token.paddingXS,
        },
      },

      [`${componentCls}-actions-btn`]: {
        '&-disabled': {
          opacity: 0.45,
        },

        '&-loading-button': {
          padding: 0,
          border: 0,
        },

        '&-loading-icon': {
          height: token.controlHeight,
          width: token.controlHeight,
          verticalAlign: 'top',
        },
        '&-recording-icon': {
          height: '1.2em',
          width: '1.2em',
          verticalAlign: 'top',
        },
      },

      // ============================ Footer =============================
      [`${componentCls}-footer`]: {
        paddingInlineStart: padding,
        paddingInlineEnd: paddingSM,
        paddingBlockEnd: paddingSM,
        paddingBlockStart: paddingXXS,
        boxSizing: 'border-box',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Sender'> = (token) => {
  const { colorPrimary } = token;
  const colorBgSlot = new FastColor(colorPrimary).setA(0.06).toRgbString();
  const colorBgSkill = new FastColor(colorPrimary).setA(0.08).toRgbString();
  const colorBgSkillHover = new FastColor(colorPrimary).setA(0.15).toRgbString();
  const colorTextSlot = colorPrimary;
  const colorTextSlotPlaceholder = new FastColor(colorPrimary).setA(0.25).toRgbString();
  const colorBorderSlotHover = new FastColor(colorPrimary).setA(0.1).toRgbString();
  const colorBorderSlot = colorBgSlot;

  return {
    colorBgSlot,
    colorBgSkill,
    colorBgSkillHover,
    colorTextSlot,
    colorTextSlotPlaceholder,
    colorBorderSlotHover,
    colorBorderSlot,
  };
};

export default genStyleHooks<'Sender'>(
  'Sender',
  (token) => {
    const { paddingXS, calc } = token;
    const SenderToken = mergeToken<SenderToken>(token, {
      SenderContentMaxWidth: `calc(100% - ${unit(
        calc(paddingXS).add(32).equal(),
      )})`,
    });
    return [
      genSenderStyle(SenderToken),
      genSenderHeaderStyle(SenderToken),
      genSenderSwitchStyle(SenderToken),
      genSlotTextAreaStyle(SenderToken),
      genTransitionCollapseStyle(SenderToken),
    ];
  },
  prepareComponentToken,
);
