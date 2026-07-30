export type XNotificationOpenArgs = NotificationOptions & {
  title: string;
  onClick?: (event: Event, close?: Notification['close']) => void;
  onClose?: (event: Event) => void;
  onError?: (event: Event) => void;
  onShow?: (event: Event) => void;
  /** Auto close delay in seconds */
  duration?: number;
};

export type UseNotificationType = [
  {
    permission: NotificationPermission;
  },
  {
    open: (arg: XNotificationOpenArgs) => void;
    close: (tags?: string[]) => void;
    requestPermission: () => Promise<NotificationPermission>;
  },
];

/** Align React `@ant-design/x` export name for the useNotification return tuple. */
export type useNotificationType = UseNotificationType;
