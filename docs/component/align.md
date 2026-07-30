# 与 Ant Design X 文档对齐

本页对照官方 React 版 [`@ant-design/x`](https://x.ant.design/)（当前对齐目标 **2.9.x**）与本仓库 `ant-design-x-vue-next` 的文档/组件状态。

## 组件对照

| 分组 | 组件 | React `@ant-design/x` | Vue Next | 文档 |
| --- | --- | --- | --- | --- |
| 通用 | Bubble | ✅ | ✅ | [文档](/component/bubble) |
| 通用 | Conversations | ✅ | ✅ | [文档](/component/conversations) |
| 通用 | Notification | ✅ | ⏳ 规划中 | [占位](/component/notification) |
| 唤醒 | Welcome | ✅ | ✅ | [文档](/component/welcome) |
| 唤醒 | Prompts | ✅ | ✅ | [文档](/component/prompts) |
| 表达 | Sender | ✅ | ✅ | [文档](/component/sender) |
| 表达 | Attachments | ✅ | ✅ | [文档](/component/attachments) |
| 表达 | Suggestion | ✅ | ✅ | [文档](/component/suggestion) |
| 反馈 | Sources | ✅ | ✅ | [文档](/component/sources) |
| 反馈 | FileCard | ✅ | ✅ | [文档](/component/file-card) |
| 表达 | Folder | ✅ | ⏳ 规划中 | [占位](/component/folder) |
| 表达 | CodeHighlighter | ✅ | ⏳ 规划中 | [占位](/component/code-highlighter) |
| 表达 | Mermaid | ✅ | ⏳ 规划中 | [占位](/component/mermaid) |
| 确认 | Think | ✅ | ✅ | [文档](/component/think) |
| 确认 | ThoughtChain | ✅ | ✅ | [文档](/component/thought-chain) |
| 反馈 | Actions | ✅ | ✅ | [文档](/component/actions) |
| 工具 | XProvider | ✅ | ✅ | [文档](/component/x-provider) |

## 独立包（React monorepo）

React 2.x 已拆出独立包，Vue Next 尚未拆分：

| 包 | React | Vue Next |
| --- | --- | --- |
| `@ant-design/x-sdk`（含 XRequest / XStream / Chat 能力） | ✅ | 仍以内置 `useXChat` / `XRequest` / `XStream` 提供 |
| `@ant-design/x-markdown` | ✅ | ⏳ |
| `@ant-design/x-card` | ✅ | ⏳ |

本仓库工具类文档：

- [useXAgent](/component/use-x-agent)
- [useXChat](/component/use-x-chat)
- [XStream](/component/x-stream)
- [XRequest](/component/x-request)

## 移植优先级

1. Sources
2. FileCard / Folder
3. Notification
4. CodeHighlighter / Mermaid
5. Markdown / SDK 能力对齐

参考源码：[`ant-design/x`](https://github.com/ant-design/x)
