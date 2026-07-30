import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'unplugin-vue-macros/vite';

export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      },
    }),
  ],
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,js,tsx}'],
    exclude: ['**/node_modules/**', '**/.ref-antd-x/**', '**/docs/**'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text', 'json'],
    },
  },
});

