import type { ActionItem, ItemType } from './interface';

/** Prefer Vue `children`, fall back to React `subItems`. */
export function getItemChildren(item: ItemType | ActionItem): ActionItem[] | undefined {
  if ('children' in item && item.children) {
    return item.children;
  }
  if ('subItems' in item && item.subItems) {
    return item.subItems;
  }
  return undefined;
}
