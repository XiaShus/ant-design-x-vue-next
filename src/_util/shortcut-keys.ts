/** Modifier prefixes aligned with @ant-design/x ShortcutKeys. */
export type PrefixKeysType = 'Ctrl' | 'Alt' | 'Meta' | 'Shift';

export type CodeKeyType = number | 'number' | PrefixKeysType;

/**
 * Tuple form used by React `@ant-design/x` (KeyCode number or `'number'` for 1–9).
 * @example `['Ctrl', 78]` for Ctrl+N · `['Ctrl', 'number']` for Ctrl+1…9
 */
export type ShortcutKeys<CustomKey = number | 'number'> =
  | [PrefixKeysType, PrefixKeysType, CustomKey]
  | [PrefixKeysType, CustomKey];

export type ShortcutKeyActionType = {
  actionShortcutKey: ShortcutKeys<number>;
  actionKeyCode: number;
  name: string;
  timeStamp: number;
  actionKeyCodeNumber: number | false;
  index?: number;
};

export type ShortcutKeyInfoType = {
  shortcutKeys: ShortcutKeys | ShortcutKeys[];
  shortcutKeysIcon: string[] | string[][];
};

/** Minimal KeyCode map (KeyboardEvent.keyCode) for common shortcuts. */
export const ShortcutKeyCode = {
  N: 78,
  UP: 38,
  DOWN: 40,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
} as const;

const PrefixEventKey: Record<PrefixKeysType, keyof KeyboardEvent> = {
  Alt: 'altKey',
  Ctrl: 'ctrlKey',
  Meta: 'metaKey',
  Shift: 'shiftKey',
};

const PrefixIcon: Record<PrefixKeysType, [apple: string, other: string]> = {
  Alt: ['⌥', 'Alt'],
  Ctrl: ['⌃', 'Ctrl'],
  Meta: ['⌘', 'Win'],
  Shift: ['⇧', 'Shift'],
};

const isAppleDevice =
  typeof navigator !== 'undefined' && /(mac|iphone|ipod|ipad)/i.test(navigator.platform || '');

const NumberKeyCodes = [
  ShortcutKeyCode.ONE,
  ShortcutKeyCode.TWO,
  ShortcutKeyCode.THREE,
  ShortcutKeyCode.FOUR,
  ShortcutKeyCode.FIVE,
  ShortcutKeyCode.SIX,
  ShortcutKeyCode.SEVEN,
  ShortcutKeyCode.EIGHT,
  ShortcutKeyCode.NINE,
];

const KeyCodeName: Record<number, string> = {
  [ShortcutKeyCode.N]: 'N',
  [ShortcutKeyCode.UP]: '↑',
  [ShortcutKeyCode.DOWN]: '↓',
  ...Object.fromEntries(NumberKeyCodes.map((code, i) => [code, String(i + 1)])),
};

export const getShortcutKeysIcon = (key: CodeKeyType): string => {
  if (key === 'number') return 'number';
  if (typeof key === 'string' && key in PrefixIcon) {
    return PrefixIcon[key as PrefixKeysType][isAppleDevice ? 0 : 1];
  }
  if (typeof key === 'number') {
    return KeyCodeName[key] || String(key);
  }
  return '';
};

export const getShortcutAction = (
  shortcutKey: ShortcutKeys<number>,
  event: KeyboardEvent,
): Omit<ShortcutKeyActionType, 'name' | 'index'> | false => {
  const copy = [...shortcutKey] as Array<PrefixKeysType | number>;
  const keyCode = copy.pop() as number;
  const signKeys = copy as PrefixKeysType[];
  const modifiersOk = signKeys.every((signKey) => Boolean(event[PrefixEventKey[signKey]]));
  if (!modifiersOk || keyCode !== event.keyCode) {
    return false;
  }
  const numIdx = NumberKeyCodes.indexOf(keyCode as (typeof NumberKeyCodes)[number]);
  return {
    actionShortcutKey: shortcutKey,
    actionKeyCodeNumber: numIdx > -1 ? numIdx : false,
    actionKeyCode: event.keyCode,
    timeStamp: event.timeStamp,
  };
};

type FlatEntry = {
  name: string;
  shortcutKey: ShortcutKeys<number>;
  index?: number;
};

export const flattenShortcutKeys = (
  componentShortcutKeys?: Record<string, ShortcutKeys | ShortcutKeys[]>,
  contextShortcutKeys?: Record<string, ShortcutKeys | ShortcutKeys[]>,
): { flatten: FlatEntry[]; info: Record<string, ShortcutKeyInfoType> } => {
  const merge = { ...(contextShortcutKeys || {}), ...(componentShortcutKeys || {}) };
  const flatten: FlatEntry[] = [];
  const info: Record<string, ShortcutKeyInfoType> = {};

  Object.keys(merge).forEach((subName) => {
    const sub = merge[subName];
    if (!Array.isArray(sub)) return;

    info[subName] = {
      shortcutKeys: sub as ShortcutKeys | ShortcutKeys[],
      shortcutKeysIcon: [],
    };

    const isListOfTuples = sub.every((item) => Array.isArray(item));
    if (isListOfTuples) {
      (sub as ShortcutKeys[]).forEach((shortcutKey, index) => {
        const arr = shortcutKey as ShortcutKeys;
        // Expand 'number' into 1–9
        const last = arr[arr.length - 1] as CodeKeyType;
        if (last === 'number') {
          const prefix = arr.slice(0, -1) as PrefixKeysType[];
          NumberKeyCodes.forEach((code, numIndex) => {
            flatten.push({
              name: subName,
              shortcutKey: [...prefix, code] as ShortcutKeys<number>,
              index: numIndex,
            });
          });
          (info[subName].shortcutKeysIcon as string[][]).push(
            arr.map((k) => getShortcutKeysIcon(k as CodeKeyType)),
          );
        } else {
          flatten.push({
            name: subName,
            shortcutKey: arr as ShortcutKeys<number>,
            index,
          });
          (info[subName].shortcutKeysIcon as string[][]).push(
            arr.map((k) => getShortcutKeysIcon(k as CodeKeyType)),
          );
        }
      });
    } else {
      const arr = sub as ShortcutKeys;
      const copy = [...arr];
      const keyCode = copy.pop() as number | 'number';
      const prefixKeys = copy as PrefixKeysType[];
      const keyCodeDict = keyCode === 'number' ? NumberKeyCodes : [keyCode as number];
      keyCodeDict.forEach((code, numIndex) => {
        flatten.push({
          name: subName,
          shortcutKey: [...prefixKeys, code] as ShortcutKeys<number>,
          index: keyCode === 'number' ? numIndex : undefined,
        });
      });
      info[subName].shortcutKeysIcon = arr.map((k) => getShortcutKeysIcon(k as CodeKeyType));
    }
  });

  return { flatten, info };
};
