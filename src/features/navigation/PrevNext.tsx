import { Link } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { m, useLocale } from '@/features/i18n'
import { allChapters, chapterPath, type ChapterRef } from '@/features/content/registry'
import { cn } from '@/shared/lib/cn'

function Card({ target, direction }: { target: ChapterRef; direction: 'prev' | 'next' }) {
  const locale = useLocale()
  const next = direction === 'next'
  const Arrow = next ? ArrowRight : ArrowLeft
  return (
    <Link
      to={chapterPath(locale, target)}
      className={cn(
        'group flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-4 shadow-card transition-colors hover:border-line-strong',
        next && 'flex-row-reverse text-end sm:col-start-2',
      )}
    >
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-ink-2 transition-colors group-hover:bg-strong group-hover:text-strong-ink">
        <Arrow size={16} className="rtl:rotate-180" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] text-muted">
          {next ? m.next_chapter() : m.prev_chapter()} · {target.part.title[locale]}
        </span>
        <span className="font-display mt-0.5 block truncate font-semibold text-ink">{target.chapter.title[locale]}</span>
      </span>
    </Link>
  )
}

export function PrevNext({ index }: { index: number }) {
  const prev = allChapters[index - 1]
  const next = allChapters[index + 1]

  return (
    <nav className="mt-16 grid max-w-[46rem] gap-3 border-t border-line pt-8 sm:grid-cols-2">
      {prev && <Card target={prev} direction="prev" />}
      {next && <Card target={next} direction="next" />}
    </nav>
  )
}
