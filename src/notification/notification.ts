import { reactive } from 'vue';
import warning from '../_util/warning';
import type { UseNotificationType, XNotificationOpenArgs } from './interface';

let uuid = 0;

type PermissionEntry = {
  close: () => void;
};

export class XNotification {
  static permissionMap: Map<string, PermissionEntry> = new Map();
  static permissible: boolean;

  constructor() {
    XNotification.permissible = typeof globalThis !== 'undefined' && !!globalThis.Notification;
    warning(
      XNotification.permissible,
      'XNotification',
      'Notification API is not supported in this environment.',
    );
  }

  public get permission(): NotificationPermission {
    if (!XNotification.permissible) {
      return 'denied';
    }
    return globalThis.Notification.permission;
  }

  public open(arg: XNotificationOpenArgs): void {
    if (!XNotification.permissible) return;
    const { title, tag, onClick, duration, onClose, onError, onShow, ...config } = arg || {};
    if (tag && XNotification.permissionMap.has(tag)) return;

    uuid += 1;
    const mergeKey = tag || `x_notification_${uuid}`;
    const notificationInstance: Notification = new globalThis.Notification(title, config || {});
    const close = notificationInstance.close.bind(notificationInstance);

    if (typeof duration === 'number') {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        close();
      }, duration * 1000);
    }

    notificationInstance.onclick = (event) => {
      onClick?.(event, close);
    };

    notificationInstance.onshow = (event) => {
      onShow?.(event);
      XNotification.permissionMap.set(mergeKey, { close });
    };

    notificationInstance.onclose = (event) => {
      onClose?.(event);
      XNotification.permissionMap.delete(mergeKey);
    };

    notificationInstance.onerror = (event) => {
      onError?.(event);
    };
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!XNotification.permissible) {
      return 'denied';
    }
    return globalThis.Notification.requestPermission();
  }

  public useNotification(): UseNotificationType {
    const state = reactive({
      permission: this.permission,
    });
    return [
      state,
      {
        open: this.open.bind(this),
        close: this.close.bind(this),
        requestPermission: async () => {
          const permissionRes = await this.requestPermission();
          state.permission = permissionRes;
          return permissionRes;
        },
      },
    ];
  }

  public close(tags?: string[]): void {
    if (!XNotification.permissible) return;
    Array.from(XNotification.permissionMap.keys()).forEach((key) => {
      if (tags === undefined) {
        XNotification.permissionMap.get(key)?.close?.();
      }
      if (tags?.includes(key)) {
        XNotification.permissionMap.get(key)?.close?.();
      }
    });
  }
}

const notification = new XNotification();

export type { XNotificationOpenArgs, UseNotificationType };
export default notification;
export { notification };
