import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Check, Eye, MessagesSquare, Play } from 'lucide-react'
import { m, useLocale } from '@/features/i18n'
import { allChapters, chapterPath, parts } from '@/features/content/registry'
import { partMeta } from '@/features/content/partMeta'
import { mdxComponents } from '@/features/content/mdx/components'
import { useProgress } from '@/features/progress'
import { cn } from '@/shared/lib/cn'
import HeroSnippet from './HeroSnippet.mdx'

function ActionCard({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-5 py-4 font-semibold text-ink shadow-card transition-colors hover:border-line-strong"
    >
      <span>{children}</span>
      <ArrowRight size={17} className="shrink-0 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
    </Link>
  )
}

export function HomePage() {
  const locale = useLocale()
  const { isRead } = useProgress()
  const findRef = (key: string) => allChapters.find((c) => c.key === key) ?? allChapters[0]

  const how = [
    { icon: Play, text: m.home_how_run() },
    { icon: Eye, text: m.home_how_predict() },
    { icon: MessagesSquare, text: m.home_how_qa() },
  ]

  return (
    <div className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <title>{m.site_title()}</title>
      <meta name="description" content={m.site_description()} />

      <section className="max-w-4xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[12px] font-medium text-ink-2">
          <span className="size-1.5 rounded-full bg-gradient-to-br from-[#7c8cff] to-[#e0447c]" />
          {m.home_badge()}
        </span>
        <h1 className="mt-4 text-[2.25rem] font-bold leading-[1.15] tracking-tight text-ink text-balance sm:text-[2.9rem]">
          {m.home_title()}
        </h1>
        <p className="mt-4 max-w-[68ch] text-[1.07rem] leading-8 text-ink-2">{m.home_subtitle()}</p>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {[
            [allChapters.length, m.home_stats_chapters()],
            [parts.length, m.home_stats_parts()],
            [2, m.home_stats_languages()],
          ].map(([value, label]) => (
            <div key={String(label)} className="flex items-baseline gap-1.5">
              <dt className="sr-only">{label}</dt>
              <dd className="font-mono text-lg font-semibold text-ink">{value}</dd>
              <span className="text-muted">{label}</span>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-9 grid gap-3 sm:grid-cols-3">
        <ActionCard to={chapterPath(locale, allChapters[0])}>{m.home_quick_start()}</ActionCard>
        <ActionCard to={chapterPath(locale, findRef('javascript/event-loop'))}>{m.home_quick_event_loop()}</ActionCard>
        <ActionCard to={chapterPath(locale, findRef('interview/trick-questions'))}>{m.home_quick_questions()}</ActionCard>
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        <div>
          <h2 className="text-xl font-semibold text-ink">{m.home_how_title()}</h2>
          <ul className="mt-5 space-y-4">
            {how.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-3.5">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-ink">
                  <Icon size={16} aria-hidden />
                </span>
                <p className="leading-7 text-ink-2">{text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="prose min-w-0 max-w-none">
          <p className="!mt-0 mb-2 text-sm font-medium text-muted">
            {m.home_try_label()} — {m.home_try_question()}
          </p>
          <HeroSnippet components={mdxComponents} />
        </div>
      </section>

      <section aria-labelledby="contents" className="mt-14">
        <h2 id="contents" className="text-xl font-semibold text-ink">
          {m.home_parts_title()}
        </h2>
        <p className="mt-1.5 max-w-[70ch] text-[15px] text-muted">{m.home_parts_lead()}</p>

        <ol className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {parts.map((part, index) => {
            const meta = partMeta[part.id]
            const Icon = meta.icon
            const doneCount = part.chapters.filter((c) => isRead(`${part.id}/${c.slug}`)).length
            const first = part.chapters.find((c) => !isRead(`${part.id}/${c.slug}`)) ?? part.chapters[0]
            return (
              <li
                key={part.id}
                id={part.id}
                className="flex scroll-mt-20 flex-col rounded-xl border border-line bg-surface p-5 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white',
                      meta.tile,
                    )}
                  >
                    <Icon size={18} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono text-[11px] text-muted">{m.part_label({ number: index + 1 })}</div>
                    <h3 className="truncate font-semibold text-ink">{part.title[locale]}</h3>
                  </div>
                  <span className="ms-auto shrink-0 font-mono text-[11px] text-muted">
                    {doneCount}/{part.chapters.length}
                  </span>
                </div>
                <p className="mt-3 text-[14px] leading-6 text-ink-2">{part.summary[locale]}</p>

                <ul className="mt-4 space-y-1 border-t border-line pt-3 text-[13.5px]">
                  {part.chapters.map((chapter) => {
                    const read = isRead(`${part.id}/${chapter.slug}`)
                    return (
                      <li key={chapter.slug}>
                        <Link
                          to={chapterPath(locale, { part, chapter })}
                          className="flex items-center gap-2 rounded-md py-0.5 text-ink-2 transition-colors hover:text-ink"
                        >
                          <span
                            className={cn(
                              'inline-flex size-4 shrink-0 items-center justify-center rounded-full border',
                              read ? 'border-ok bg-ok text-white' : 'border-line-strong',
                            )}
                          >
                            {read && <Check size={10} strokeWidth={3} />}
                          </span>
                          <span className="truncate">{chapter.title[locale]}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>

                <Link
                  to={chapterPath(locale, { part, chapter: first })}
                  className="mt-auto inline-flex items-center gap-1 pt-4 text-[13.5px] font-medium text-accent underline underline-offset-4"
                >
                  {m.start_part()}
                  <ArrowRight size={14} className="rtl:rotate-180" />
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
