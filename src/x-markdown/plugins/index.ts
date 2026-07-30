import Latex from './Latex';
import type { LatexOption } from './Latex';

export type { LatexOption };

export type PluginsType = {
  /**
   * @desc 渲染数学公式 Latex 语法
   * @descEN Rendering mathematical formulas using Latex syntax
   */
  Latex: (options?: LatexOption) => ReturnType<typeof Latex>;
};

export const plugins: PluginsType = {
  Latex,
};

export { Latex };
export default plugins;
