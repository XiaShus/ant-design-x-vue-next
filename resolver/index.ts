
export interface AntDesignXResolverOptions {
  /**
   * exclude components that do not require automatic import
   *
   * @default []
   */
  exclude?: string[]

  /**
   * rename package
   *
   * @default 'ant-design-x-vue-next'
   */
  packageName?: string

  /**
   * customizable prefix for resolving components
   *
   * @default 'AX'
   */
  prefix?: string
}

/**
 * set of components that are contained in the package
 * (name after stripping the `AX` prefix from template tags)
 */
const primitiveNames = new Set<string>([
  'Actions',
  'Attachments',
  'Bubble',
  'Conversations',
  'Prompts',
  'Provider',
  'Sender',
  'Suggestion',
  'Think',
  'ThoughtChain',
  'Sources',
  'FileCard',
  'Folder',
  'CodeHighlighter',
  'Mermaid',
  'XMarkdown',
  'XCard',
  'Box',
  'Card',
  'Welcome',
])

/**
 * Map template suffix → actual named export from the package.
 * `<AXProvider>` strips to `Provider`, but the export is `XProvider`.
 */
const exportNameMap: Record<string, string> = {
  Provider: 'XProvider',
}

function isAntdXVueComponent(name: string) {
  return primitiveNames.has(name)
}

export function AntDesignXVueResolver(
  options: AntDesignXResolverOptions = {}
) {
  const {
    prefix = 'AX',
    packageName = 'ant-design-x-vue-next',
    exclude = []
  } = options

  const resolverInfo = {
    type: 'component',
    resolve: (name: string) => {
      if (!name.startsWith(prefix)) return

      const componentName = name.slice(prefix.length)

      if (
        !isAntdXVueComponent(componentName) || exclude.includes(componentName)
      ) return

      const exportName = exportNameMap[componentName] || componentName

      return {
        name: exportName,
        from: packageName,
        as: `${prefix}${componentName}`
      }
    }
  }
  return resolverInfo.resolve
}
