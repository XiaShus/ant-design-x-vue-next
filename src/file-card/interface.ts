import type { CSSProperties, HTMLAttributes, VNode } from 'vue';
import type { ImageProps, SpinProps } from 'ant-design-vue';
import type { AvoidValidation } from '../type-utility';

/** Align React FileCard spinProps (Spin + showText / icon / percent). */
export type FileCardSpinProps = SpinProps & {
  showText?: boolean;
  icon?: AvoidValidation<VNode>;
  /** Progress percent; `'auto'` simulates progress text (Vue Spin has no percent ring). */
  percent?: number | 'auto';
  /** Accept React `middle` as alias of Vue `default`. */
  size?: SpinProps['size'] | 'middle' | 'medium';
};

export type FileCardSemanticType = 'root' | 'file' | 'icon' | 'name' | 'description';

export type CardType = 'file' | 'image' | 'audio' | 'video';

export type PresetIcons =
  | 'default'
  | 'excel'
  | 'image'
  | 'markdown'
  | 'pdf'
  | 'ppt'
  | 'word'
  | 'zip'
  | 'video'
  | 'audio'
  | 'java'
  | 'javascript'
  | 'python';

export type CardInfo = {
  size: string;
  icon: any;
  namePrefix?: string;
  nameSuffix?: string;
  name?: string;
  src?: string;
  type?: CardType;
};

type ExtendNode = false | VNode | string | ((info: CardInfo) => VNode | string | false | null);

export interface FileCardProps extends /* @vue-ignore */ Omit<HTMLAttributes, 'onClick'> {
  prefixCls?: string;
  rootClassName?: string;
  className?: string;
  class?: string;
  style?: CSSProperties;
  classNames?: Partial<Record<FileCardSemanticType, string>>;
  styles?: Partial<Record<FileCardSemanticType, CSSProperties>>;
  name: string;
  byte?: number;
  size?: 'small' | 'default';
  description?: AvoidValidation<ExtendNode>;
  loading?: boolean;
  src?: string;
  mask?: AvoidValidation<ExtendNode>;
  icon?: AvoidValidation<VNode | PresetIcons>;
  type?: CardType;
  imageProps?: ImageProps;
  /** Align React: image loading Spin / progress overlay props. */
  spinProps?: FileCardSpinProps;
  videoProps?: Record<string, any>;
  audioProps?: Record<string, any>;
  onClick?: (info: CardInfo, event: MouseEvent) => void;
}

export type FileCardListSemanticType = 'root' | 'card';

/**
 * List item may carry React-aligned `key` for identity.
 * Not declared on FileCardProps because Vue reserves `key`.
 */
export type FileCardListItem = FileCardProps & { key?: string | number };

export interface FileCardListProps {
  prefixCls?: string;
  className?: string;
  class?: string;
  rootClassName?: string;
  classNames?: Partial<Record<FileCardListSemanticType | FileCardSemanticType, string>>;
  style?: CSSProperties;
  styles?: Partial<Record<FileCardListSemanticType | FileCardSemanticType, CSSProperties>>;
  items: FileCardListItem[];
  size?: 'small' | 'default';
  removable?: boolean | ((item: FileCardListItem) => boolean);
  onRemove?: (item: FileCardListItem) => void;
  extension?: AvoidValidation<VNode | string>;
  overflow?: 'scrollX' | 'scrollY' | 'wrap';
}
