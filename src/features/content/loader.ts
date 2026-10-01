import type { MDXContent } from 'mdx/types'
import type { Locale } from '@/features/i18n'

/** Every chapter is its own lazily-loaded chunk. */
const modules = import.meta.glob<{ default: MDXContent }>('/src/content/*/*/*.mdx')

const cache = new Map<string, Promise<MDXContent | null>>()

const pathOf = (locale: Locale, part: string, chapter: string) =>
  `/src/content/${locale}/${part}/${chapter}.mdx`

export const hasChapter = (locale: Locale, part: string, chapter: string) =>
  pathOf(locale, part, chapter) in modules

/** Returns a stable promise per chapter so it can be passed to React's `use()`. */
export function loadChapter(locale: Locale, part: string, chapter: string) {
  const path = pathOf(locale, part, chapter)
  let promise = cache.get(path)
  if (!promise) {
    const load = modules[path]
    promise = load ? load().then((mod) => mod.default) : Promise.resolve(null)
    cache.set(path, promise)
  }
  return promise
}

export function preloadChapter(locale: Locale, part: string, chapter: string) {
  if (hasChapter(locale, part, chapter)) void loadChapter(locale, part, chapter)
}
