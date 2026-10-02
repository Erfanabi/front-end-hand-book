import { Outlet, useParams } from 'react-router'
import { m } from '@/features/i18n'
import { BackToTop, Header, Logo, ProgressCard, Sidebar } from '@/features/navigation'

/**
 * App shell: the outline lives on the grey canvas, content sits in one framed
 * panel. The same shell is used for the overview page and every chapter.
 */
export function AppShell() {
  const { chapter } = useParams()
  return (
    <div className="lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-2 lg:p-2">
      <aside className="hidden lg:block">
        <div className="sticky top-2 flex h-[calc(100dvh-1rem)] flex-col">
          <div className="px-3 pb-5 pt-3">
            <Logo />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-4 scrollbar-thin">
            <Sidebar />
          </div>
          <div className="px-1.5 pb-1 pt-2">
            <ProgressCard />
          </div>
        </div>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col bg-surface lg:min-h-[calc(100dvh-1rem)] lg:rounded-2xl lg:border lg:border-line lg:shadow-card">
        <Header />
        <main id="content" className="min-w-0 flex-1">
          <Outlet />
        </main>
        <footer className="border-t border-line px-5 py-5 text-[13px] text-muted sm:px-8">{m.footer_note()}</footer>
      </div>
      {chapter && <BackToTop />}
    </div>
  )
}
