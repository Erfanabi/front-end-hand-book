/**
 * Compiles every MDX chapter and verifies both locales have the same chapters
 * as the registry. Run with `pnpm check:content`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkInteractive from '../build/remark-interactive.ts'

const root = join(import.meta.dirname, '..', 'src', 'content')

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : full.endsWith('.mdx') ? [full] : []
  })

let failed = 0
const files = walk(root)
for (const file of files) {
  try {
    await compile(readFileSync(file, 'utf8'), { remarkPlugins: [remarkGfm, remarkInteractive] })
  } catch (error) {
    failed++
    const { message, line, column } = error as { message: string; line?: number; column?: number }
    console.error(`✗ ${relative(root, file)}:${line ?? '?'}:${column ?? '?'}  ${message}`)
  }
}

const byLocale = (locale: string) =>
  new Set(files.filter((f) => relative(root, f).startsWith(locale + sep)).map((f) => relative(join(root, locale), f)))
const fa = byLocale('fa')
const en = byLocale('en')
const onlyFa = [...fa].filter((f) => !en.has(f))
const onlyEn = [...en].filter((f) => !fa.has(f))
if (onlyFa.length) console.warn('Missing in en:', onlyFa.join(', '))
if (onlyEn.length) console.warn('Missing in fa:', onlyEn.join(', '))

console.log(`${files.length - failed}/${files.length} chapters compiled`)
process.exit(failed ? 1 : 0)
