import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { ChevronRight, Command, Languages, Menu, Search } from 'lucide-react'
import { m, otherLocale, switchLocalePath, useLocale } from '@/features/i18n'
import { ThemeToggle } from '@/features/theme'
import { allChapters, findChapter } from '@/features/content/registry'
import { IconButton } from '@/shared/ui/IconButton'
import { Drawer } from './Drawer'
import { SearchDialog } from './search/SearchDialog'
import { ReadingProgress } from './ReadingProgress'
import { ProgressCard, Sidebar } from './Sidebar'

export function Logo({ compact = false }: { compact?: boolean }) {
  const locale = useLocale()
  return (
    <Link to={`/${locale}`} className="flex min-w-0 items-center gap-2.5 font-semibold text-ink">
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7c8cff" />
            <stop offset="1" stopColor="#e0447c" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#logo-g)" />
        <path
          d="M11.5 10.5 6.5 16l5 5.5M20.5 10.5l5 5.5-5 5.5M17.6 8.5l-3.2 15"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!compact && (
        <>
          <span className="font-display truncate text-[15px]">{m.site_short()}</span>
          <span className="rounded-md border border-line bg-surface px-1.5 py-px font-mono text-[10px] font-medium uppercase tracking-wide text-muted">
            v2
          </span>
        </>
      )}
    </Link>
  )
}

function Breadcrumb() {
  const locale = useLocale()
  const { part, chapter } = useParams()
  const index = findChapter(part, chapter)
  const ref = index === -1 ? undefined : allChapters[index]

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-[14px] md:flex">
      <Link to={`/${locale}`} className="shrink-0 text-ink-2 transition-colors hover:text-ink">
        {m.nav_overview()}
      </Link>
      {ref && (
        <>
          <ChevronRight size={14} className="shrink-0 text-muted rtl:rotate-180" aria-hidden />
          <Link to={`/${locale}#${ref.part.id}`} className="shrink-0 text-ink-2 transition-colors hover:text-ink">
            {ref.part.title[locale]}
          </Link>
          <ChevronRight size={14} className="shrink-0 text-muted rtl:rotate-180" aria-hidden />
          <span className="truncate font-medium text-ink" aria-current="page">
            {ref.chapter.title[locale]}
          </span>
        </>
      )}
    </nav>
  )
}

/** Top bar of the content panel: breadcrumb, command box, language and theme. */
export function Header() {
  const locale = useLocale()
  const { pathname, hash } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const target = otherLocale(locale)
  const { chapter } = useParams()
  const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur-md lg:rounded-t-2xl">
      <a
        href="#content"
        className="absolute start-2 top-2 -translate-y-20 rounded-md bg-strong px-3 py-2 text-sm text-strong-ink focus:translate-y-0"
      >
        {m.skip_to_content()}
      </a>
      <div className="flex h-14 items-center gap-2 px-3 sm:px-5">
        <IconButton label={m.nav_open_menu()} onClick={() => setMenuOpen(true)} className="lg:hidden">
          <Menu size={19} />
        </IconButton>
        <div className="lg:hidden">
          <Logo compact />
        </div>

        <Breadcrumb />

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="ms-auto flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-line bg-surface-2 px-2.5 text-[13.5px] text-muted transition-colors hover:border-line-strong hover:text-ink-2 sm:w-64"
        >
          <Command size={14} className="hidden sm:block" aria-hidden />
          <Search size={15} className="sm:hidden" aria-hidden />
          <span className="hidden min-w-0 flex-1 truncate text-start sm:inline">{m.nav_command()}</span>
          <span className="sr-only sm:hidden">{m.nav_search()}</span>
          <kbd
            dir="ltr"
            className="hidden rounded-md border border-line bg-surface px-1.5 font-mono text-[10.5px] leading-5 text-muted sm:inline"
          >
            {isMac ? '⌘K' : 'Ctrl K'}
          </kbd>
        </button>

        <span className="mx-1 hidden h-6 w-px bg-line sm:block" aria-hidden />

        <Link
          to={switchLocalePath(pathname, target) + hash}
          aria-label={m.nav_language_label()}
          lang={target}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-[13px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
        >
          <Languages size={15} aria-hidden />
          <span className="hidden sm:inline">{m.nav_language_switch()}</span>
        </Link>
        <ThemeToggle />
      </div>

      {chapter && <ReadingProgress />}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title={m.nav_contents()}>
        <Sidebar onNavigate={() => setMenuOpen(false)} />
        <div className="mt-6">
          <ProgressCard onNavigate={() => setMenuOpen(false)} />
        </div>
      </Drawer>
    </header>
  )
}
