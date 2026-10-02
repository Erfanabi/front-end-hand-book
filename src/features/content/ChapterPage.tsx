import { Suspense, use, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Link, NavLink, useLocation, useParams } from 'react-router'
import { BookOpen, Check, Clock, GitBranch, Link2, ListTree, MessagesSquare, Play } from 'lucide-react'
import { m, otherLocale, useLocale, type Locale } from '@/features/i18n'
import { PrevNext, Toc } from '@/features/navigation'
import { useProgress } from '@/features/progress'
import { useCopy } from '@/shared/hooks/useCopy'
import { cn } from '@/shared/lib/cn'
import { Spinner } from '@/shared/ui/Spinner'
import { NotFoundPage } from '@/features/navigation/NotFoundPage'
import { loadChapter } from './loader'
import { mdxComponents } from './mdx/components'
import { partMeta } from './partMeta'
import { allChapters, chapterPath, findChapter } from './registry'

function ChapterBody({ locale, part, slug, onReady }: { locale: Locale; part: string; slug: string; onReady: () => void }) {
  const Content = use(loadChapter(locale, part, slug))

  useLayoutEffect(onReady, [onReady])

  if (!Content) {
    const other = otherLocale(locale)
    return (
      <div className="rounded-xl border border-line bg-surface-2 p-6 text-ink-2">
        <p>{m.chapter_missing()}</p>
        <Link to={`/${other}/${part}/${slug}`} className="mt-3 inline-block font-medium text-accent" lang={other}>
          {other === 'en' ? 'Read in English' : 'خواندن به فارسی'}
        </Link>
      </div>
    )
  }

  return <Content components={mdxComponents} />
}

interface Stats {
  minutes: number
  sections: number
  questions: number
  diagrams: number
  runnable: number
}

/** Reading time and content counts, measured from the rendered article. */
function useChapterStats(articleRef: RefObject<HTMLElement | null>, ready: boolean): Stats | null {
  const [stats, setStats] = useState<Stats | null>(null)
  useEffect(() => {
    const article = articleRef.current
    if (!ready || !article) return
    const words = (article.textContent ?? '').split(/\s+/).length
    setStats({
      minutes: Math.max(1, Math.round(words / 190)),
      sections: article.querySelectorAll('h2').length,
      questions: article.querySelectorAll('[data-qa]').length,
      diagrams: article.querySelectorAll('[data-diagram]').length,
      runnable: article.querySelectorAll('[data-runner]').length,
    })
  }, [articleRef, ready])
  return stats
}

/** Scrolls to the hash target once the lazily-loaded content exists, otherwise to the top. */
function useScrollOnNavigate(ready: boolean) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!ready) return
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    // Instant, not smooth: a smooth scroll gets cut short while the new page is still laying out.
    if (target) {
      target.scrollIntoView({ behavior: 'instant' })
      requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' }))
    } else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, ready])
}

function Meta({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-muted">{icon}</span>
      {children}
    </span>
  )
}

export function ChapterPage() {
  const locale = useLocale()
  const { part = '', chapter = '' } = useParams()
  const index = findChapter(part, chapter)
  const articleRef = useRef<HTMLElement>(null)
  const [readyKey, setReadyKey] = useState('')
  const key = `${locale}/${part}/${chapter}`
  const ready = readyKey === key
  const { isRead, toggle } = useProgress()
  const stats = useChapterStats(articleRef, ready)
  const { copied, copy } = useCopy()
  useScrollOnNavigate(ready)
  const pillsRef = useRef<HTMLElement>(null)

  // Keep the current chapter's pill visible when the strip overflows.
  useEffect(() => {
    // Scrolls only the strip itself (scrollIntoView would also move the page).
    const strip = pillsRef.current
    const pill = strip?.querySelector<HTMLElement>('[aria-current="page"]')
    if (strip && pill) strip.scrollLeft += pill.getBoundingClientRect().left - strip.getBoundingClientRect().left - (strip.clientWidth - pill.offsetWidth) / 2
  }, [key])

  if (index === -1) return <NotFoundPage />

  const ref = allChapters[index]
  const progressKey = ref.key
  const read = isRead(progressKey)
  const title = ref.chapter.title[locale]
  const description = ref.chapter.desc?.[locale] ?? ref.part.summary[locale]
  const meta = partMeta[ref.part.id]
  const Icon = meta.icon

  return (
    <>
      <title>{`${title} · ${m.site_title()}`}</title>
      <meta name="description" content={description} />
      <link rel="alternate" hrefLang={otherLocale(locale)} href={chapterPath(otherLocale(locale), ref)} />

      {/* Chapter header */}
      <header className="border-b border-line bg-surface-2/70 px-5 py-7 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-start gap-4">
          <span
            className={cn(
              'inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-card',
              meta.tile,
            )}
          >
            <Icon size={24} strokeWidth={2} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <h1 className="text-[1.6rem] font-bold leading-tight tracking-tight text-ink text-balance sm:text-[1.85rem]">
                {title}
              </h1>
              <button
                type="button"
                onClick={() => copy(location.href.split('#')[0])}
                title={copied ? m.link_copied() : m.copy_link()}
                aria-label={copied ? m.link_copied() : m.copy_link()}
                className="mt-1.5 inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-active hover:text-ink"
              >
                {copied ? <Check size={15} /> : <Link2 size={15} />}
              </button>
            </div>
            <p className="mt-1.5 max-w-[75ch] text-[15px] leading-7 text-ink-2">{description}</p>
          </div>
          <button
            type="button"
            onClick={() => toggle(progressKey)}
            aria-pressed={read}
            className={cn(
              'inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-medium transition-colors',
              read
                ? 'border border-ok/40 bg-ok-soft text-ok'
                : 'bg-strong text-strong-ink hover:opacity-90',
            )}
          >
            <Check size={15} aria-hidden />
            {read ? m.marked_read() : m.mark_read()}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-2">
          <Meta icon={<BookOpen size={15} />}>
            <Link to={`/${locale}#${ref.part.id}`} className="font-medium text-ink hover:text-accent">
              {m.part_label({ number: ref.partIndex + 1 })} · {ref.part.title[locale]}
            </Link>
          </Meta>
          {stats && (
            <>
              <Meta icon={<Clock size={15} />}>{m.reading_time({ minutes: stats.minutes })}</Meta>
              <Meta icon={<ListTree size={15} />}>{m.chapter_sections({ count: stats.sections })}</Meta>
              {stats.runnable > 0 && <Meta icon={<Play size={15} />}>{m.chapter_runnable({ count: stats.runnable })}</Meta>}
              {stats.diagrams > 0 && <Meta icon={<GitBranch size={15} />}>{m.chapter_diagrams({ count: stats.diagrams })}</Meta>}
              {stats.questions > 0 && (
                <Meta icon={<MessagesSquare size={15} />}>{m.chapter_questions({ count: stats.questions })}</Meta>
              )}
            </>
          )}
        </div>
      </header>

      {/* Sibling chapters as pill tabs */}
      <nav
        ref={pillsRef}
        aria-label={m.in_this_part()}
        className="flex gap-2 overflow-x-auto border-b border-line px-5 py-3 scrollbar-thin sm:px-8 lg:px-10"
      >
        {ref.part.chapters.map((c, i) => (
          <NavLink
            key={c.slug}
            to={chapterPath(locale, { part: ref.part, chapter: c })}
            className={({ isActive }) =>
              cn(
                'inline-flex h-8 shrink-0 items-center gap-2 rounded-full border px-3 text-[13px] font-medium transition-colors',
                isActive
                  ? 'border-strong bg-strong text-strong-ink'
                  : 'border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink',
              )
            }
          >
            <span className="font-mono text-[11px] opacity-60">{String(i + 1).padStart(2, '0')}</span>
            {c.title[locale]}
            {isRead(`${ref.part.id}/${c.slug}`) && <Check size={13} className="text-ok" aria-hidden />}
          </NavLink>
        ))}
      </nav>

      <div className="flex">
        <aside className="hidden w-60 shrink-0 border-e border-line xl:block">
          <div className="sticky top-14 max-h-[calc(100dvh-4.5rem)] overflow-y-auto px-4 py-7 scrollbar-thin">
            <Toc articleRef={articleRef} ready={ready} key={key} />
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
          <article ref={articleRef} className="prose" key={key}>
            <Suspense fallback={<Spinner label={m.loading()} />}>
              <ChapterBody locale={locale} part={part} slug={chapter} onReady={() => setReadyKey(key)} />
            </Suspense>
          </article>

          <PrevNext index={index} />
        </div>
      </div>
    </>
  )
}
