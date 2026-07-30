import { Marked, type MarkedExtension, type Tokens } from 'marked';

export type ParseMarkdownOptions = {
  markedConfig?: MarkedExtension;
  openLinksInNewTab?: boolean;
  injectTail?: boolean;
  tailContent?: string;
};

const DEFAULT_TAIL = '|';

function escapeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function parseMarkdown(source: string, options: ParseMarkdownOptions = {}): string {
  if (!source) {
    return '';
  }

  const markdown = new Marked();

  markdown.use({
    renderer: {
      link({ href, title, text }: Tokens.Link) {
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
        const targetAttrs = options.openLinksInNewTab
          ? ' target="_blank" rel="noopener noreferrer"'
          : '';
        return `<a href="${escapeHtml(href || '')}"${titleAttr}${targetAttrs}>${text}</a>`;
      },
      code({ text, lang }: Tokens.Code) {
        const language = (lang || '').trim().split(/\s+/)[0] || '';
        const className = language ? ` class="language-${escapeHtml(language)}"` : '';
        const langAttr = language ? ` data-language="${escapeHtml(language)}"` : '';
        return `<pre${langAttr}><code${className}>${escapeHtml(text)}</code></pre>\n`;
      },
    },
  });

  if (options.markedConfig) {
    markdown.use(options.markedConfig);
  }

  let output = markdown.parse(source, { async: false }) as string;

  if (options.injectTail) {
    const tail = options.tailContent ?? DEFAULT_TAIL;
    output = `${output}<span class="xmd-tail">${escapeHtml(tail)}</span>`;
  }

  return output;
}
