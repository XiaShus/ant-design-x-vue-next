# Notification 系统通知

系统级别发送在页面外部显示的通知（浏览器 Web Notification API）。对齐 [`@ant-design/x` Notification](https://x.ant.design/components/notification-cn)。

## 何时使用

- 在智能体执行复杂任务时，可推送系统应用级别通知，使用户随时掌握任务进展。
- 受操作系统通知权限管控，仅用于强通知场景。

## 注意

- **`notification` 为系统应用通知**，受操作系统通知权限管控；若权限关闭，`open` 将无效果。
- 由扩展 `window.Notification` 实现；浏览器不支持时方法调用无效果。
- 通知样式与效果以当前浏览器对 Notification 的支持为准。
- 仅对当前实例下已推送的通知进行关闭管理；页面刷新后无法关闭此前通知。

> 与 `ant-design-vue` 的 UI Toast `notification` 不同。若同时使用，请对其中一方做别名导入。

## 代码演示

### Hooks 调用

:::demo 通过 `useNotification` 请求权限并推送通知。

notification/hooks

:::

### 自动关闭延时

:::demo 设置 `duration`（秒）后自动关闭。

notification/duration

:::

### 关闭指定通知

:::demo 通过 `tag` 关闭指定通知。

notification/close-tag

:::

### 静态方法

:::demo 在非组件上下文中使用静态方法。

notification/static-method

:::

## API

成功发送通知需确保已授权当前域名通知权限。

### notification / XNotification

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| permission | 当前来源是否已授予显示 Web 通知的权限 | `NotificationPermission` | - |
| requestPermission | 向用户请求显示通知的权限 | `() => Promise<NotificationPermission>` | - |
| open | 向用户推送一个通知 | `(config: XNotificationOpenArgs) => void` | - |
| close | 关闭已推送的通知；传入 tag 列表可关闭指定通知，无参数则关闭全部 | `(tags?: string[]) => void` | - |

#### NotificationPermission

```ts
type NotificationPermission = 'granted' | 'denied' | 'default';
```

#### XNotificationOpenArgs

```ts
type XNotificationOpenArgs = NotificationOptions & {
  title: string;
  onClick?: (event: Event, close?: Notification['close']) => void;
  onClose?: (event: Event) => void;
  onError?: (event: Event) => void;
  onShow?: (event: Event) => void;
  duration?: number; // 秒
};
```

### useNotification

自 `1.93.0` 起可从包入口 `import type { useNotificationType, UseNotificationType }`（`useNotificationType` 为 React 同名别名）。

```ts
const [{ permission }, { open, close, requestPermission }] = useNotification();
// 或
const [{ permission }, api] = notification.useNotification();
```

## 贡献者

<doc-contributors component-name="notification" :max-count="50" :show-view-all="true" />
