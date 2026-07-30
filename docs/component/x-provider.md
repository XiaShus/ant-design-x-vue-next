# XProvider 全局化配置

为组件提供统一的全局化配置。

## 使用说明

`XProvider` 继承了 `antdv` 的 `ConfigProvider`，且为 `ant-design-x-vue` 中的组件提供全局化配置。

如果您已经使用 `antdv` 的 `ConfigProvider`，请对您的代码做如下变更：

```diff
- import { ConfigProvider } from 'ant-design-vue';
+ import { XProvider } from 'ant-design-x-vue';

  const App = () => (
-   <ConfigProvider>
+   <XProvider>
      <YourApp />
-   </ConfigProvider>
+   </XProvider>
  );
```

## 代码演示

### 使用

:::demo 如何使用

x-provider/use

:::

### 国际化

:::demo 通过 `locale` 配置 X 组件文案（与 ant-design-vue locale 合并）。未设置时组件文案默认 `en_US`。

x-provider/locale

:::

```ts
import { XProvider } from 'ant-design-x-vue-next';
import zhCN from 'ant-design-x-vue-next/locale/zh_CN';
import antdZhCN from 'ant-design-vue/es/locale/zh_CN';

<XProvider :locale="{ ...antdZhCN, ...zhCN }">
  <App />
</XProvider>
```

## API

`XProvider` 完全继承 `antdv` 的 `ConfigProvider`, 属性参考：[Antdv ConfigProvider](https://www.antdv.com/components/config-provider-cn#api)

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| locale | ant-design-vue locale 与 X 组件文案包合并 | `Locale`（含 Conversations / Actions / Bubble / Mermaid / Folder / Sender） | - | 1.23.0 |

### 组件配置

通过 `XProvider` 传入下列键，可为对应组件提供默认的 `classNames` / `styles` / `className` / `style`（已由运行时 `XComponentsConfig` 支持；`1.90.0` 补齐文档）。

自 `1.107.0` 起可从包入口 `import type { XComponentsConfig, XComponentStyleConfig, ComponentStyleConfig }`。

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| bubble | 气泡组件的全局配置 | ComponentStyleConfig\<BubbleProps\> | - | 1.107.0（类型导出） |
| conversations | 会话组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - |  |
| prompts | 提示集组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - |  |
| sender | 输入框组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - |  |
| suggestion | 建议组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - |  |
| thoughtChain | 思维链组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - |  |
| actions | 操作列表组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - | 1.90.0（文档） |
| welcome | 欢迎组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - | 1.90.0（文档） |
| attachments | 附件组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - | 1.90.0（文档） |
| think | 思考组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - | 1.90.0（文档） |
| sources | 引用来源组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - | 1.90.0（文档） |
| fileCard | 文件卡片组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - | 1.90.0（文档） |
| folder | 文件夹组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - | 1.90.0（文档） |
| codeHighlighter | 代码高亮组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - | 1.90.0（文档） |
| mermaid | Mermaid 组件的全局配置 | `'classNames' \| 'styles' \| 'className' \| 'style'` | - | 1.90.0（文档） |

## 贡献者

<doc-contributors component-name="x-provider" :max-count="50" :show-view-all="true" />
