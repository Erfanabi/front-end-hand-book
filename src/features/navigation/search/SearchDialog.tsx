import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { CornerDownLeft, FileText, Hash, Search } from 'lucide-react'
import { m, useLocale } from '@/features/i18n'
import { cn } from '@/shared/lib/cn'
import { loadIndex, search } from './searchModel'

type Index = Awaited<ReturnType<typeof loadIndex>>

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const locale = useLocale()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [index, setIndex] = useState<Index>([])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      loadIndex().then(setIndex)
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  const results = useMemo(() => search(index, locale, query), [index, locale, query])

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (href: string) => {
    onClose()
    setQuery('')
    navigate(href)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      go(results[active].href)
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={m.nav_search()}
      className="mx-auto mt-[12vh] w-[min(40rem,92vw)] max-w-none overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-card backdrop:bg-black/40 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search size={18} className="shrink-0 text-muted" aria-hidden />
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
          placeholder={m.nav_search_placeholder()}
          aria-label={m.nav_search()}
          className="h-14 w-full bg-transparent text-[16px] outline-none placeholder:text-muted"
        />
      </div>

      {query && (
        <ul ref={listRef} role="listbox" className="max-h-[55vh] overflow-y-auto p-2 scrollbar-thin">
          {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">{m.nav_search_empty()}</li>}
          {results.map((result, i) => {
            const isHeading = result.key.includes('#')
            const Icon = isHeading ? Hash : FileText
            return (
              <li key={result.key} role="option" aria-selected={i === active} data-active={i === active}>
                <button
                  type="button"
                  onClick={() => go(result.href)}
                  onMouseMove={() => setActive(i)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-start',
                    i === active ? 'bg-accent-soft' : '',
                  )}
                >
                  <Icon size={16} className={cn('shrink-0', i === active ? 'text-accent' : 'text-muted')} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{result.title}</span>
                    <span className="block truncate text-xs text-muted">{result.context}</span>
                  </span>
                  {i === active && <CornerDownLeft size={14} className="shrink-0 text-muted" aria-hidden />}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="border-t border-line px-4 py-2 text-xs text-muted">{m.nav_search_hint()}</div>
    </dialog>
  )
}
