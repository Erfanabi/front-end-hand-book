import type { Code, Root, RootContent } from 'mdast'
import type { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx'

/**
 * Turns special fenced code blocks into interactive MDX components so content
 * stays plain markdown:
 *
 *   ```mermaid                → <Mermaid chart="…" />
 *   ```js run                 → <CodeRunner code="…">highlighted code</CodeRunner>
 *   ```js run sloppy          → same, but executed as a classic (non-strict) script
 *   ```js predict  + ```output → <Predict code="…" output="…">highlighted code</Predict>
 *   ```html live              → <LivePreview code="…" />
 *
 * The original code node is kept as a child, so Shiki still highlights it at
 * build time and no editor is needed until the reader clicks "Edit".
 */
const attr = (name: string, value: string): MdxJsxAttribute => ({
  type: 'mdxJsxAttribute',
  name,
  value,
})

const element = (
  name: string,
  attributes: MdxJsxAttribute[],
  children: Code[] = [],
): MdxJsxFlowElement => ({
  type: 'mdxJsxFlowElement',
  name,
  attributes,
  children,
})

const hasFlag = (node: Code, flag: string) =>
  (node.meta ?? '').split(/\s+/).includes(flag)

const modeAttr = (node: Code) => (hasFlag(node, 'sloppy') ? [attr('mode', 'sloppy')] : [])

type Parent = { children: RootContent[] }

function transform(parent: Parent) {
  const out: RootContent[] = []
  const nodes = parent.children

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]

    if ('children' in node && Array.isArray(node.children)) {
      transform(node as Parent)
    }

    if (node.type !== 'code') {
      out.push(node)
      continue
    }

    if (node.lang === 'mermaid') {
      out.push(element('Mermaid', [attr('chart', node.value)]))
      continue
    }

    if (hasFlag(node, 'predict')) {
      const next = nodes[i + 1]
      const output = next?.type === 'code' && next.lang === 'output' ? next.value : ''
      if (output) i++
      const clean: Code = { ...node, meta: null }
      out.push(element('Predict', [attr('code', node.value), attr('output', output), ...modeAttr(node)], [clean]))
      continue
    }

    if (hasFlag(node, 'run')) {
      const clean: Code = { ...node, meta: null }
      out.push(element('CodeRunner', [attr('code', node.value), ...modeAttr(node)], [clean]))
      continue
    }

    if (node.lang === 'html' && hasFlag(node, 'live')) {
      out.push(element('LivePreview', [attr('code', node.value)]))
      continue
    }

    out.push(node)
  }

  parent.children = out
}

export default function remarkInteractive() {
  return (tree: Root) => transform(tree as Parent)
}
