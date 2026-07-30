import { StreamCacheTokenType } from './interface';

/* ------------ Type ------------ */

export interface StreamCache {
  pending: string;
  token: StreamCacheTokenType;
  processedLength: number;
  completeMarkdown: string;
  fence: FenceState;
}

/**
 * Incremental fenced-code-block state over the processed text, updated in O(1)
 * per character. Recomputing over the full accumulated text on every character
 * is O(N²) and freezes the page on long single-line content such as base64
 * image data URIs.
 */
interface FenceState {
  inFenced: boolean;
  fenceChar: string;
  fenceLen: number;
  lineFenceChar: string;
  lineFenceLen: number;
  lineFenceRunEnded: boolean;
  lineTailBlank: boolean;
}

/**
 * When a token is about to be committed, if a non-empty string is returned,
 * only that prefix is committed and the rest of the pending content is left
 * for subsequent recognition.
 */
interface Recognizer {
  tokenType: StreamCacheTokenType;
  isStartOfToken: (markdown: string) => boolean;
  isStreamingValid: (markdown: string) => boolean;
  getCommitPrefix?: (pending: string) => string | null;
}

/* ------------ Constants ------------ */
const STREAM_INCOMPLETE_REGEX = {
  image: [/^!\[[^\]\r\n]{0,1000}$/, /^!\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
  link: [/^\[[^\]\r\n]{0,1000}$/, /^\[[^\r\n]{0,1000}\]\(*[^)\r\n]{0,1000}$/],
  html: [/^<\/$/, /^<\/?[a-zA-Z][a-zA-Z0-9-]{0,100}[^>\r\n]{0,1000}$/],
  commonEmphasis: [/^(\*{1,3}|_{1,3})(?!\s)(?!.*\1$)[^\r\n]{0,1000}$/],
  list: [/^[-+*]\s{0,3}$/, /^[-+*]\s{1,3}(\*{1,3}|_{1,3})(?!\s)(?!.*\1$)[^\r\n]{0,1000}$/],
  'inline-code': [/^`[^`\r\n]{0,300}$/],
} as const;

const isTableInComplete = (markdown: string) => {
  if (markdown.includes('\n\n')) return false;

  const lines = markdown.split('\n');
  if (lines.length <= 1) return true;

  const [header, separator] = lines;
  const trimmedHeader = header.trim();
  if (!/^\|.*\|$/.test(trimmedHeader)) return false;

  const trimmedSeparator = separator.trim();
  const columns = trimmedSeparator
    .split('|')
    .map((col) => col.trim())
    .filter(Boolean);

  const separatorRegex = /^:?-+:?$/;
  return columns.every((col, index) =>
    index === columns.length - 1
      ? col === ':' || separatorRegex.test(col)
      : separatorRegex.test(col),
  );
};

const tokenRecognizerMap: Partial<Record<StreamCacheTokenType, Recognizer>> = {
  [StreamCacheTokenType.Link]: {
    tokenType: StreamCacheTokenType.Link,
    isStartOfToken: (markdown: string) => markdown.startsWith('['),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.link.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.Image]: {
    tokenType: StreamCacheTokenType.Image,
    isStartOfToken: (markdown: string) => markdown.startsWith('!'),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.image.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.Html]: {
    tokenType: StreamCacheTokenType.Html,
    isStartOfToken: (markdown: string) => markdown.startsWith('<'),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.html.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.Emphasis]: {
    tokenType: StreamCacheTokenType.Emphasis,
    isStartOfToken: (markdown: string) => markdown.startsWith('*') || markdown.startsWith('_'),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.commonEmphasis.some((re) => re.test(markdown)),
  },
  [StreamCacheTokenType.List]: {
    tokenType: StreamCacheTokenType.List,
    isStartOfToken: (markdown: string) => /^[-+*]/.test(markdown),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX.list.some((re) => re.test(markdown)),
    getCommitPrefix: (pending: string) => {
      const listPrefix = pending.match(/^([-+*]\s{0,3})/)?.[1];
      const rest = listPrefix ? pending.slice(listPrefix.length) : '';
      return listPrefix && rest.startsWith('`') ? listPrefix : null;
    },
  },
  [StreamCacheTokenType.Table]: {
    tokenType: StreamCacheTokenType.Table,
    isStartOfToken: (markdown: string) => markdown.startsWith('|'),
    isStreamingValid: isTableInComplete,
  },
  [StreamCacheTokenType.InlineCode]: {
    tokenType: StreamCacheTokenType.InlineCode,
    isStartOfToken: (markdown: string) => markdown.startsWith('`'),
    isStreamingValid: (markdown: string) =>
      STREAM_INCOMPLETE_REGEX['inline-code'].some((re) => re.test(markdown)),
  },
};

const recognize = (cache: StreamCache, tokenType: StreamCacheTokenType): void => {
  const recognizer = tokenRecognizerMap[tokenType];
  if (!recognizer) return;

  const { token, pending } = cache;
  if (token === StreamCacheTokenType.Text && recognizer.isStartOfToken(pending)) {
    cache.token = tokenType;
    return;
  }

  if (token === tokenType && !recognizer.isStreamingValid(pending)) {
    const prefix = recognizer.getCommitPrefix?.(pending);
    if (prefix) {
      cache.completeMarkdown += prefix;
      cache.pending = pending.slice(prefix.length);
      cache.token = StreamCacheTokenType.Text;
      return;
    }
    commitCache(cache);
  }
};

const recognizeHandlers = Object.values(tokenRecognizerMap).map((rec) => ({
  tokenType: rec.tokenType,
  recognize: (cache: StreamCache) => recognize(cache, rec.tokenType),
}));

/* ------------ Utils ------------ */
const getInitialFenceState = (): FenceState => ({
  inFenced: false,
  fenceChar: '',
  fenceLen: 0,
  lineFenceChar: '',
  lineFenceLen: 0,
  lineFenceRunEnded: false,
  lineTailBlank: true,
});

export const getInitialCache = (): StreamCache => ({
  pending: '',
  token: StreamCacheTokenType.Text,
  processedLength: 0,
  completeMarkdown: '',
  fence: getInitialFenceState(),
});

const commitCache = (cache: StreamCache): void => {
  if (cache.pending) {
    cache.completeMarkdown += cache.pending;
    cache.pending = '';
  }
  cache.token = StreamCacheTokenType.Text;
};

const feedFenceState = (fence: FenceState, char: string): void => {
  if (char === '\n') {
    if (fence.lineFenceLen >= 3) {
      if (!fence.inFenced) {
        fence.inFenced = true;
        fence.fenceChar = fence.lineFenceChar;
        fence.fenceLen = fence.lineFenceLen;
      } else if (
        fence.lineFenceChar === fence.fenceChar &&
        fence.lineFenceLen >= fence.fenceLen &&
        fence.lineTailBlank
      ) {
        fence.inFenced = false;
        fence.fenceChar = '';
        fence.fenceLen = 0;
      }
    }
    fence.lineFenceChar = '';
    fence.lineFenceLen = 0;
    fence.lineFenceRunEnded = false;
    fence.lineTailBlank = true;
    return;
  }

  if (!fence.lineFenceRunEnded) {
    if (fence.lineFenceLen === 0 && (char === '`' || char === '~')) {
      fence.lineFenceChar = char;
      fence.lineFenceLen = 1;
    } else if (fence.lineFenceLen > 0 && char === fence.lineFenceChar) {
      fence.lineFenceLen += 1;
    } else {
      fence.lineFenceRunEnded = true;
      fence.lineTailBlank = fence.lineTailBlank && /\s/.test(char);
    }
  } else {
    fence.lineTailBlank = fence.lineTailBlank && /\s/.test(char);
  }
};

const isInCodeBlock = (fence: FenceState): boolean => fence.inFenced || fence.lineFenceLen >= 3;

const sanitizeForURIComponent = (input: string): string => {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);

    if (charCode >= 0xd800 && charCode <= 0xdbff) {
      if (
        i + 1 < input.length &&
        input.charCodeAt(i + 1) >= 0xdc00 &&
        input.charCodeAt(i + 1) <= 0xdfff
      ) {
        result += input[i] + input[i + 1];
        i++;
      }
    } else if (charCode < 0xdc00 || charCode > 0xdfff) {
      result += input[i];
    }
  }
  return result;
};

export const safeEncodeURIComponent = (str: string): string => {
  try {
    return encodeURIComponent(str);
  } catch (e) {
    if (e instanceof URIError) {
      return encodeURIComponent(sanitizeForURIComponent(str));
    }
    return '';
  }
};

export type IncompleteComponentMap = Partial<
  Record<Exclude<StreamCacheTokenType, StreamCacheTokenType.Text>, string>
>;

export function buildIncompletePlaceholder(
  cache: StreamCache,
  options: {
    incompleteMarkdownComponentMap?: IncompleteComponentMap;
    componentNames?: string[];
  } = {},
): string | undefined {
  const { token, pending } = cache;
  if (token === StreamCacheTokenType.Text) return;

  if (token === StreamCacheTokenType.Image && pending === '!') return undefined;

  if (token === StreamCacheTokenType.Table && pending.split('\n').length > 2) {
    return pending;
  }

  const componentMap = options.incompleteMarkdownComponentMap || {};
  const componentName = componentMap[token] || `incomplete-${token}`;
  const encodedPending = safeEncodeURIComponent(pending);
  const names = options.componentNames || [];

  return names.includes(componentName)
    ? `<${componentName} data-raw="${encodedPending}" />`
    : undefined;
}

/**
 * Feed incremental markdown into the stream cache and return renderable output.
 * Incomplete tokens are held in `pending` until closed (or replaced by placeholder).
 */
export function processStreamingText(
  cache: StreamCache,
  text: string,
  options: {
    incompleteMarkdownComponentMap?: IncompleteComponentMap;
    componentNames?: string[];
  } = {},
): string {
  if (!text) {
    Object.assign(cache, getInitialCache());
    return '';
  }

  const expectedPrefix = cache.completeMarkdown + cache.pending;
  if (!text.startsWith(expectedPrefix)) {
    Object.assign(cache, getInitialCache());
  }

  const chunk = text.slice(cache.processedLength);
  if (!chunk) {
    const incompletePlaceholder = buildIncompletePlaceholder(cache, options);
    return cache.completeMarkdown + (incompletePlaceholder || '');
  }

  cache.processedLength += chunk.length;
  for (const char of chunk) {
    cache.pending += char;
    feedFenceState(cache.fence, char);
    if (isInCodeBlock(cache.fence)) {
      commitCache(cache);
      continue;
    }
    if (cache.token === StreamCacheTokenType.Text) {
      for (const handler of recognizeHandlers) handler.recognize(cache);
    } else {
      const handler = recognizeHandlers.find((h) => h.tokenType === cache.token);
      handler?.recognize(cache);
      if (cache.token === StreamCacheTokenType.Text) {
        for (const h of recognizeHandlers) h.recognize(cache);
      }
    }

    if (cache.token === StreamCacheTokenType.Text) {
      commitCache(cache);
    }
  }

  const incompletePlaceholder = buildIncompletePlaceholder(cache, options);
  return cache.completeMarkdown + (incompletePlaceholder || '');
}
