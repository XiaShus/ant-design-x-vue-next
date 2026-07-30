import Prism from 'prismjs';

const LANG_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  py: 'python',
  md: 'markdown',
  yml: 'yaml',
  sh: 'bash',
  shell: 'bash',
};

/** Load order / dependencies for common Prism language components */
const LANG_DEPS: Record<string, string[]> = {
  clike: [],
  markup: [],
  css: [],
  javascript: ['clike'],
  typescript: ['javascript'],
  jsx: ['markup', 'javascript'],
  tsx: ['jsx', 'typescript'],
  json: ['javascript'],
  bash: [],
  python: [],
  markdown: ['markup'],
  yaml: [],
  java: ['clike'],
  go: ['clike'],
  rust: [],
  sql: [],
  less: ['css'],
  scss: ['css'],
  c: ['clike'],
  cpp: ['c'],
  csharp: ['clike'],
  php: ['markup', 'markup-templating'],
  'markup-templating': ['markup'],
  ruby: [],
  swift: [],
  kotlin: ['clike'],
  objectivec: ['c'],
  graphql: [],
  diff: [],
  docker: [],
  nginx: [],
};

const COMMON_FULL_LANGS = [
  'markup',
  'css',
  'clike',
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'json',
  'bash',
  'python',
  'markdown',
  'yaml',
  'java',
  'go',
  'rust',
  'sql',
  'less',
  'scss',
];

const loadingCache = new Map<string, Promise<void>>();
let fullPrismPromise: Promise<void> | null = null;

function resolveLang(lang: string): string {
  return LANG_ALIASES[lang] || lang;
}

async function importLanguageComponent(lang: string): Promise<void> {
  if (Prism.languages[lang]) {
    return;
  }

  const cached = loadingCache.get(lang);
  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const deps = LANG_DEPS[lang] || [];
    for (const dep of deps) {
      await importLanguageComponent(dep);
    }
    if (Prism.languages[lang]) {
      return;
    }
    try {
      await import(/* @vite-ignore */ `prismjs/components/prism-${lang}.js`);
    } catch (error) {
      console.warn(`[CodeHighlighter] Failed to load language: ${lang}`, error);
    }
  })();

  loadingCache.set(lang, promise);
  try {
    await promise;
  } finally {
    // keep resolved promise for subsequent callers
  }
}

export async function ensureLanguage(lang: string): Promise<string> {
  const resolved = resolveLang(lang);
  await importLanguageComponent(resolved);
  return resolved;
}

export async function ensureFullPrism(): Promise<void> {
  if (!fullPrismPromise) {
    fullPrismPromise = Promise.all(COMMON_FULL_LANGS.map((lang) => ensureLanguage(lang))).then(
      (): void => undefined,
    );
  }
  return fullPrismPromise;
}

export function escapeHtml(code: string): string {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function highlightCode(code: string, lang: string): string {
  const grammar = Prism.languages[lang];
  if (!grammar) {
    return escapeHtml(code);
  }
  return Prism.highlight(code, grammar, lang);
}

export { Prism };
