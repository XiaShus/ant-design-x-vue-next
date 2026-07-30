import notification, { XNotification } from './notification';

export type { XNotificationOpenArgs, UseNotificationType } from './interface';

export { notification, XNotification };
export default notification;

/** Vue composable alias for `notification.useNotification()` */
export function useNotification() {
  return notification.useNotification();
}
