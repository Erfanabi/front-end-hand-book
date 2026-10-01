import type { Locale } from '@/features/i18n'
import { parts } from '@/features/content/registry'

export interface SearchResult {
  key: string
  title: string
  context: string
  href: string
  score: number
}

interface IndexEntry {
  lang: string
  part: string
  chapter: string
  heading: string
  id: string
}

let indexPromise: Promise<IndexEntry[]> | undefined
/** The heading index is a separate chunk, fetched the first time search opens. */
export const loadIndex = () =>
  (indexPromise ??= import('virtual:search-index').then((mod) => mod.default as IndexEntry[]))

/** Folds Arabic/Persian letter variants, ZWNJ and case so queries match loosely. */
export const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[\u200c\u200f]/g, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[`*_]/g, '')
    .trim()

function score(haystack: string, query: string) {
  const index = haystack.indexOf(query)
  if (index === -1) return 0
  return index === 0 ? 3 : /\s/.test(haystack[index - 1] ?? '') ? 2 : 1
}

export function search(entries: IndexEntry[], locale: Locale, rawQuery: string): SearchResult[] {
  const query = normalize(rawQuery)
  if (!query) return []
  const results: SearchResult[] = []

  for (const part of parts) {
    for (const chapter of part.chapters) {
      const title = chapter.title[locale]
      const s = score(normalize(title), query)
      if (s) {
        results.push({
          key: `${part.id}/${chapter.slug}`,
          title,
          context: part.title[locale],
          href: `/${locale}/${part.id}/${chapter.slug}`,
          score: s + 10,
        })
      }
    }
  }

  for (const entry of entries) {
    if (entry.lang !== locale) continue
    const s = score(normalize(entry.heading), query)
    if (!s) continue
    const part = parts.find((p) => p.id === entry.part)
    const chapter = part?.chapters.find((c) => c.slug === entry.chapter)
    if (!part || !chapter) continue
    results.push({
      key: `${entry.part}/${entry.chapter}#${entry.id}`,
      title: entry.heading,
      context: `${part.title[locale]} › ${chapter.title[locale]}`,
      href: `/${locale}/${entry.part}/${entry.chapter}#${entry.id}`,
      score: s,
    })
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 40)
}
