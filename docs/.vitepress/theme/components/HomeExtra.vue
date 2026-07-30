<script setup lang="ts">
const richStages = [
  {
    title: '1. 唤醒',
    desc: '让用户快速理解 AI 能做什么',
    links: [
      { text: 'Welcome', href: '/component/welcome' },
      { text: 'Prompts', href: '/component/prompts' },
    ],
  },
  {
    title: '2. 表达',
    desc: '帮助用户正确表达意图并附带内容',
    links: [
      { text: 'Sender', href: '/component/sender' },
      { text: 'Attachments', href: '/component/attachments' },
      { text: 'Folder', href: '/component/folder' },
    ],
  },
  {
    title: '3. 确认',
    desc: '展示任务执行与思考过程',
    links: [
      { text: 'Think', href: '/component/think' },
      { text: 'ThoughtChain', href: '/component/thought-chain' },
    ],
  },
  {
    title: '4. 反馈',
    desc: '呈现结果并支持快捷操作',
    links: [
      { text: 'Actions', href: '/component/actions' },
      { text: 'Sources', href: '/component/sources' },
      { text: 'FileCard', href: '/component/file-card' },
    ],
  },
]
</script>

<template>
  <div class="home-extra">
    <h2>最近更新</h2>
    <p>
      当前最新版本
      <a href="/development/changelog">1.7.0</a>
      （2026-07-30）。完整记录见更新日志。
    </p>
    <ul class="recent-list">
      <li>🆕 Think / Sources / FileCard / Folder 组件已可用</li>
      <li>📖 文档侧边栏分组对齐官方 Ant Design X</li>
      <li>
        🛠 npm 安装：
        <code>pnpm add ant-design-vue ant-design-x-vue-next</code>
      </li>
    </ul>

    <h2>AI 设计范式 · RICH</h2>
    <p>
      基于官方
      <a href="https://x.ant.design/docs/spec/introduce-cn" target="_blank" rel="noreferrer"
        >RICH 设计指南</a
      >
      ，在 Vue 中覆盖唤醒、表达、确认、反馈全链路组件。
    </p>
    <div class="rich-grid">
      <div v-for="stage in richStages" :key="stage.title" class="rich-card">
        <h3>{{ stage.title }}</h3>
        <p>{{ stage.desc }}</p>
        <div>
          <a
            v-for="(link, index) in stage.links"
            :key="link.href"
            :href="link.href"
            style="margin-right: 10px"
          >
            {{ link.text }}<span v-if="index < stage.links.length - 1"> ·</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
