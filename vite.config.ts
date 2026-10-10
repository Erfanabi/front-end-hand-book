import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeShiki from '@shikijs/rehype'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import type { ShikiTransformer } from 'shiki'
import remarkInteractive from './build/remark-interactive.ts'
import { searchIndexPlugin } from './build/search-index-plugin.ts'
import { reactRuntimePlugin } from './build/react-runtime-plugin.ts'

const src = fileURLToPath(new URL('./src', import.meta.url))

/** Tags every highlighted <pre> with its language (for the label) and forces LTR. */
const codeBlockMeta: ShikiTransformer = {
  pre(node) {
    node.properties['data-lang'] = this.options.lang
    node.properties.dir = 'ltr'
  },
}

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm, remarkInteractive],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeShiki,
            {
              themes: { light: 'github-light', dark: 'github-dark' },
              defaultColor: false,
              fallbackLanguage: 'text',
              defaultLanguage: 'text',
              transformers: [codeBlockMeta],
            },
          ],
        ],
      }),
    },
    react({ include: /\.(mdx|jsx|tsx|ts|js)$/ }),
    tailwindcss(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      emitTsDeclarations: true,
    }),
    searchIndexPlugin(`${src}/content`),
    reactRuntimePlugin(),
  ],
  resolve: {
    alias: { '@': src },
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
})
