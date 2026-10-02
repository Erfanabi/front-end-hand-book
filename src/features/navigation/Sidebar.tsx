import { useState, type ReactNode } from 'react'
import { Link, NavLink, useParams } from 'react-router'
import { ArrowRight, Check, ChevronDown, House } from 'lucide-react'
import { m, useLocale } from '@/features/i18n'
import { allChapters, chapterPath, parts } from '@/features/content/registry'
import { iconOf } from '@/features/content/partMeta'
import { useProgress } from '@/features/progress'
import { cn } from '@/shared/lib/cn'

function Tile({ active, children }: { active?: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex size-7 shrink-0 items-center justify-center rounded-lg border transition-colors',
        active ? 'border-strong bg-strong text-strong-ink' : 'border-line bg-surface text-ink-2',
      )}
    >
      {children}
    </span>
  )
}

/** Full handbook outline: icon tile per part, chapters hang off a guide line. */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const locale = useLocale()
  const params = useParams()
  const { isRead } = useProgress()
  const [open, setOpen] = useState<Set<string>>(() => new Set(params.part ? [params.part] : []))

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <nav className="text-[14px]">
      <NavLink
        to={`/${locale}`}
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-lg px-2 py-1.5 font-medium transition-colors',
            isActive ? 'bg-active text-ink' : 'text-ink-2 hover:bg-active/60 hover:text-ink',
          )
        }
      >
        {({ isActive }) => (
          <>
            <Tile active={isActive}>
              <House size={15} />
            </Tile>
            {m.nav_overview()}
          </>
        )}
      </NavLink>

      <div className="mb-1.5 mt-6 px-2 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-muted">
        {m.nav_parts()}
      </div>

      <ul className="space-y-0.5">
        {parts.map((part) => {
          const expanded = open.has(part.id)
          const current = params.part === part.id
          const doneCount = part.chapters.filter((c) => isRead(`${part.id}/${c.slug}`)).length
          const Icon = iconOf(part.id)
          return (
            <li key={part.id}>
              <button
                type="button"
                onClick={() => toggle(part.id)}
                aria-expanded={expanded}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-start transition-colors hover:bg-active/60',
                  current ? 'font-semibold text-ink' : 'font-medium text-ink-2 hover:text-ink',
                )}
              >
                <Tile active={current}>
                  <Icon size={15} />
                </Tile>
                <span className="flex-1 leading-5">{part.title[locale]}</span>
                {doneCount > 0 && (
                  <span className="font-mono text-[11px] font-normal text-muted">
                    {doneCount}/{part.chapters.length}
                  </span>
                )}
                <ChevronDown size={14} className={cn('text-muted transition-transform', expanded && 'rotate-180')} />
              </button>
              {expanded && (
                <ul className="mb-2 ms-[1.4rem] mt-0.5 border-s border-line-strong ps-3">
                  {part.chapters.map((chapter) => {
                    const read = isRead(`${part.id}/${chapter.slug}`)
                    return (
                      <li key={chapter.slug}>
                        <NavLink
                          to={chapterPath(locale, { part, chapter })}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            cn(
                              'relative flex items-start gap-2 rounded-md px-2.5 py-1.5 leading-[1.45] transition-colors',
                              isActive
                                ? 'bg-active font-medium text-ink before:absolute before:-start-[calc(0.75rem+1px)] before:inset-y-1.5 before:w-0.5 before:rounded-full before:bg-strong'
                                : 'text-muted hover:text-ink',
                            )
                          }
                        >
                          <span className="flex-1">{chapter.title[locale]}</span>
                          {read && <Check size={13} className="mt-1 shrink-0 text-ok" aria-hidden />}
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** "Upgrade"-style card at the foot of the sidebar: overall progress and a resume button. */
export function ProgressCard({ onNavigate }: { onNavigate?: () => void }) {
  const locale = useLocale()
  const { read } = useProgress()
  const total = allChapters.length
  const done = allChapters.filter((c) => read.includes(c.key)).length
  const next = allChapters.find((c) => !read.includes(c.key)) ?? allChapters[0]
  const percent = Math.round((done / total) * 100)

  return (
    <div className="rounded-xl border border-line bg-surface p-3.5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-ink">{m.progress_title()}</span>
        <span className="rounded-md border border-line px-1.5 font-mono text-[10.5px] text-muted">{percent}%</span>
      </div>
      <p className="mt-1 text-[12px] leading-5 text-muted">{m.progress_summary({ done, total })}</p>
      <div className="mt-2.5 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-active">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7c8cff] to-[#2459e0] transition-[width] rtl:bg-gradient-to-l"
            style={{ width: `${Math.max(percent, 2)}%` }}
          />
        </div>
        <span className="font-mono text-[11px] text-ink-2">
          {done}/{total}
        </span>
      </div>
      <Link
        to={chapterPath(locale, next)}
        onClick={onNavigate}
        className="mt-3 flex h-8 items-center justify-center gap-1.5 rounded-lg bg-strong text-[12.5px] font-medium text-strong-ink transition-opacity hover:opacity-90"
      >
        {done ? m.continue_reading() : m.start_reading()}
        <ArrowRight size={13} className="rtl:rotate-180" aria-hidden />
      </Link>
    </div>
  )
}
