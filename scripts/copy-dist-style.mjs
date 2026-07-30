import { copyFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');

if (!existsSync(distDir)) {
  throw new Error('dist/ not found. Run build:dist first.');
}

const cssFiles = readdirSync(distDir).filter((name) => name.endsWith('.css'));
const preferred = cssFiles.find((name) => name === 'ant-design-x-vue-next.css');
const source = preferred || cssFiles[0];

if (!source) {
  throw new Error('No CSS asset found in dist/.');
}

const from = join(distDir, source);
const to = join(distDir, 'style.css');
copyFileSync(from, to);
console.log(`[copy-dist-style] ${source} -> style.css`);
