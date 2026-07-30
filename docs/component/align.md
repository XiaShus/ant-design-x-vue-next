# 与 Ant Design X 文档对齐

本页对照官方 React 版 [`@ant-design/x`](https://x.ant.design/)（当前对齐目标 **2.9.x**）与本仓库 `ant-design-x-vue-next` 的文档/组件状态。

## 组件对照

| 分组 | 组件 | React `@ant-design/x` | Vue Next | 文档 |
| --- | --- | --- | --- | --- |
| 通用 | Bubble | ✅ | ✅（含 System / Divider / List `role`+语义；Bubble 语义 `root`/`body`；`scrollBoxNativeElement`+`scrollTo.top` / `contentRender`+`InfoType` / `extra` / avatar BubbleSlot / streaming / typing） | [文档](/component/bubble) |
| 通用 | Conversations | ✅ | ✅（含 `creation` / `Conversations.Creation`、`shortcutKeys`、`groupable.collapsible` + 折叠动效、`onActiveChange(key, item)`、divider、`classNames/styles` root/group；移动端菜单常显；`nativeElement` ref） | [文档](/component/conversations) |
| 通用 | Notification | ✅ | ✅ | [文档](/component/notification) |
| 唤醒 | Welcome | ✅ | ✅（含 `classNames/styles` root/title/description/icon/extra、`nativeElement` ref） | [文档](/component/welcome) |
| 唤醒 | Prompts | ✅ | ✅（含 `fadeIn` / `fadeInLeft`、`classNames/styles` 含 `root`、`nativeElement` ref） | [文档](/component/prompts) |
| 表达 | Sender | ✅ | ✅（含 `suffix`/`actions`、Switch、词槽 contentEditable、`insert`+cursor/`replaceCharacters`、`classNames/styles` root/content、`inputElement`、locale） | [文档](/component/sender) |
| 表达 | Attachments | ✅ | ✅（含 `select` / `fileNativeElement`、默认插槽触发、`#upload` + `maxCount` 隐藏） | [文档](/component/attachments) |
| 表达 | Suggestion | ✅ | ✅（含 `icon`/`extra` 渲染、`onSelect` 第二参、`open` children prop、`classNames/styles` root/content/popup） | [文档](/component/suggestion) |
| 反馈 | Sources | ✅ | ✅ | [文档](/component/sources) |
| 反馈 | FileCard | ✅ | ✅ | [文档](/component/file-card) |
| 表达 | Folder | ✅ | ✅ | [文档](/component/folder) |
| 表达 | CodeHighlighter | ✅ | ✅ | [文档](/component/code-highlighter) |
| 表达 | Mermaid | ✅ | ✅ | [文档](/component/mermaid) |
| 确认 | Think | ✅ | ✅ | [文档](/component/think) |
| 确认 | ThoughtChain | ✅ | ✅（含 `ThoughtChain.Item`；链级 `line` / expand；items `status`：`loading`/`abort`；`blink`·`collapsible`·`destroyOnHidden`；`classNames/styles` root/item/itemHeader/itemIcon/itemContent/itemFooter；`nativeElement` ref） | [文档](/component/thought-chain) |
| 反馈 | Actions | ✅ | ✅（含 Copy / Feedback / Item / Audio、`fadeIn`/`fadeInLeft`、`dropdownProps`、`outlined`/`filled`、`classNames/styles` root/item/itemDropdown、`nativeElement` ref） | [文档](/component/actions) |
| 工具 | XProvider | ✅ | ✅（含 X locale pack / `useLocale`） | [文档](/component/x-provider) |
| 工具 | useMobile | ✅ | ✅ | [文档](/component/use-mobile) |

## 独立包（React monorepo）

React 2.x 已拆出独立包，Vue Next 尚未拆分：

| 包 | React | Vue Next |
| --- | --- | --- |
| `@ant-design/x-sdk`（含 XRequest / XStream / Chat 能力） | ✅ | 内置：timeout/retry/abort + `setXRequestGlobalOptions` + `createManualXRequest` / `AbstractXRequestClass` + `AbstractChatProvider` 可托管 request + OpenAI / DeepSeek + `useXConversations` + async defaults / queue / extraInfo + `XMCPClient`（未拆独立包） |
| `@ant-design/x-markdown` | ✅ | ✅ 内置（安全清洗 + 流式缓存 + LaTeX + AnimationText + DebugPanel） |
| `@ant-design/x-card` | ✅ | ✅ A2UI v0.9 + v0.8 + `registerBasicCatalog` 内置组件（Text/Button/TextField/布局等） |
| `@ant-design/x-skill` | ✅ | ⏳（非运行时 UI） |

本仓库工具类文档：

- [XMarkdown](/component/x-markdown)
- [XCard](/component/x-card)
- [useXAgent](/component/use-x-agent)
- [useXChat](/component/use-x-chat)
- [useXConversations](/component/use-x-conversations)
- [useMobile](/component/use-mobile)
- [XStream](/component/x-stream)
- [XRequest](/component/x-request)

## 移植优先级

1. ~~Sources~~ ✅
2. ~~FileCard / Folder~~ ✅
3. ~~Notification~~ ✅
4. ~~CodeHighlighter~~ ✅
5. ~~Mermaid~~ ✅
6. ~~XMarkdown MVP + 安全加固 + 流式 token 缓存 + LaTeX + DebugPanel~~ ✅（继续对齐独立包）
7. ~~SDK：AbstractChatProvider + Default/OpenAI/DeepSeek + useXConversations + XMCPClient~~ ✅（继续对齐独立包拆分 / AbstractXRequestClass）
8. ~~`x-card`（A2UI v0.9 + v0.8 + Basic Catalog）~~ ✅

参考源码：[`ant-design/x`](https://github.com/ant-design/x)
