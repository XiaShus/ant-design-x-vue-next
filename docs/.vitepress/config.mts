import { defineConfig } from 'vitepress'
import VueMacros from 'unplugin-vue-macros/vite'
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url'
import { mdPlugin } from './config/plugins'
import vueJsx from '@vitejs/plugin-vue-jsx';
import { MarkdownTransform } from './plugins/markdown-transform';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
    resolve: {
      alias: [
        {
          find: /^ant-design-x-vue$/,
          replacement: path.resolve(__dirname, '../../src')
        },
        {
          find: /^ant-design-x-vue-next$/,
          replacement: path.resolve(__dirname, '../../src')
        },
        {
          find: /^.*\/VPHero\.vue$/,
          replacement: fileURLToPath(
            new URL('./vitepress/components/vp-hero.vue', import.meta.url)
          )
        }
      ]
    },
    ssr: {
      noExternal: ['ant-design-vue', '@ant-design/icons-vue'], // 避免打包为 CommonJS
    },
    build: {
      rollupOptions: {
        output: {
          globals: {
            'ant-design-vue': 'AntDesignVue',
          },
        },
      },
    },
    plugins: [
      VueMacros({
        plugins: {
          vueJsx: vueJsx(),
        },
        // 覆盖插件选项
      }),
      MarkdownTransform(),
    ],
  },
  markdown: {
    config: (md) => mdPlugin(md),
  },
  title: "Ant Design X Vue Next",
  description: "Ant Design X For Vue — community continuation aligned with @ant-design/x",
  head: [
    ['link', { rel: 'icon', href: '/images/x-logo.svg' }],
  ],
  appearance: 'dark',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
    nav: [
      { text: '研发', link: '/development/introduce' },
      { text: '组件', link: '/component/overview' },
      { text: '演示', link: '/playground/independent' },
      { text: '更新日志', link: '/development/changelog' },
      {
        text: '更多',
        items: [
          { text: '与 Ant Design X 对齐', link: '/component/align' },
          { text: 'Ant Design X of React', link: 'https://x.ant.design/index-cn' },
          { text: '官方更新日志', link: 'https://x.ant.design/changelog-cn' },
          { text: '原 Vue 仓库', link: 'https://github.com/wzc520pyfm/ant-design-x-vue' },
          { text: 'Ant Design Vue', link: 'https://www.antdv.com/components/overview-cn' },
        ]
      }
    ],
    outline: [2, 3],

    sidebar: {
      '/development': [
        {
          text: 'Ant Design X of Vue',
          link: '/development/introduce'
        },
        {
          text: '样式兼容',
          link: '/development/compatible-style'
        },
        {
          text: '更新日志',
          link: '/development/changelog'
        },
      ],
      '/component/': [
        {
          text: '总览',
          items: [
            { text: '组件总览', link: '/component/overview' },
            { text: '与 Ant Design X 对齐', link: '/component/align' },
          ]
        },
        {
          text: '通用',
          items: [
            { text: 'Bubble 对话气泡框', link: '/component/bubble' },
            { text: 'Conversations 管理对话', link: '/component/conversations' },
            { text: 'Notification 系统通知', link: '/component/notification' },
          ]
        },
        {
          text: '唤醒',
          items: [
            { text: 'Welcome 欢迎', link: '/component/welcome' },
            { text: 'Prompts 提示集', link: '/component/prompts' }
          ]
        },
        {
          text: '表达',
          items: [
            { text: 'Sender 输入框', link: '/component/sender' },
            { text: 'Attachments 输入附件', link: '/component/attachments' },
            { text: 'Suggestion 快捷指令', link: '/component/suggestion' },
            { text: 'Folder 文件夹', link: '/component/folder' },
            { text: 'CodeHighlighter 代码高亮 ⏳', link: '/component/code-highlighter' },
            { text: 'Mermaid 图表渲染 ⏳', link: '/component/mermaid' },
          ]
        },
        {
          text: '确认',
          items: [
            { text: 'Think 思考过程', link: '/component/think' },
            { text: 'ThoughtChain 思维链', link: '/component/thought-chain' }
          ]
        },
        {
          text: '反馈',
          items: [
            { text: 'Actions 操作列表', link: '/component/actions' },
            { text: 'Sources 引用来源', link: '/component/sources' },
            { text: 'FileCard 文件卡片', link: '/component/file-card' },
          ]
        },
        {
          text: '工具',
          items: [
            { text: 'useXAgent 模型调度', link: '/component/use-x-agent' },
            { text: 'useXChat 数据管理', link: '/component/use-x-chat' },
            { text: 'XStream 流', link: '/component/x-stream' },
            { text: 'XRequest 请求', link: '/component/x-request' },
            { text: 'XProvider 全局化配置', link: '/component/x-provider' }
          ]
        },
      ],
      '/playground/': [
        {
          text: '样板间',
          items: [
            { text: '独立式', link: '/playground/independent' },
            { text: '助手式', link: '/playground/copilot' }
          ]
        },
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/XiaShus/ant-design-x-vue-next' }
    ]
  }
})
