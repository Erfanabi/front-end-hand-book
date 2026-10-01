import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import GithubSlugger from 'github-slugger'
import type { Plugin } from 'vite'

/**
 * Exposes `virtual:search-index`: every h2/h3 of every MDX chapter, per locale.
 * Slugs are generated with github-slugger, exactly like rehype-slug does at
 * render time, so search results can deep-link to a heading.
 */
export interface SearchEntry {
  lang: string
  part: string
  chapter: string
  heading: string
  id: string
  depth: number
}

const VIRTUAL_ID = 'virtual:search-index'
const RESOLVED_ID = '\0' + VIRTUAL_ID

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : full.endsWith('.mdx') ? [full] : []
  })
}

const plainText = (md: string) =>
  md
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()

function extract(file: string, contentDir: string): SearchEntry[] {
  const [lang, part, name] = relative(contentDir, file).split(sep)
  const chapter = name.replace(/\.mdx$/, '')
  const slugger = new GithubSlugger()
  const entries: SearchEntry[] = []
  let inFence = false

  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (/^\s*```/.test(line)) inFence = !inFence
    if (inFence) continue
    const match = /^(#{2,3})\s+(.+)$/.exec(line)
    if (!match) continue
    const heading = plainText(match[2])
    entries.push({ lang, part, chapter, heading, id: slugger.slug(heading), depth: match[1].length })
  }
  return entries
}

export function searchIndexPlugin(contentDir: string): Plugin {
  return {
    name: 'search-index',
    resolveId: (id) => (id === VIRTUAL_ID ? RESOLVED_ID : undefined),
    load(id) {
      if (id !== RESOLVED_ID) return
      const files = walk(contentDir)
      files.forEach((file) => this.addWatchFile(file))
      const index = files.flatMap((file) => extract(file, contentDir))
      return `export default ${JSON.stringify(index)}`
    },
    handleHotUpdate({ file, server }) {
      if (!file.endsWith('.mdx')) return
      const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
      if (mod) server.moduleGraph.invalidateModule(mod)
    },
  }
}
