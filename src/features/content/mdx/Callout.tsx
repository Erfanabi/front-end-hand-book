import type { ReactNode } from 'react'
import { AlertTriangle, Info, Lightbulb, MessagesSquare, XCircle } from 'lucide-react'
import { m } from '@/features/i18n'
import { cn } from '@/shared/lib/cn'

const variants = {
  note: { icon: Info, label: m.callout_note, edge: 'before:bg-muted', tile: 'bg-active text-ink-2' },
  tip: { icon: Lightbulb, label: m.callout_tip, edge: 'before:bg-ok', tile: 'bg-ok-soft text-ok' },
  warning: { icon: AlertTriangle, label: m.callout_warning, edge: 'before:bg-warn', tile: 'bg-warn-soft text-warn' },
  interview: { icon: MessagesSquare, label: m.callout_interview, edge: 'before:bg-accent', tile: 'bg-accent-soft text-accent' },
  mistake: { icon: XCircle, label: m.callout_mistake, edge: 'before:bg-danger', tile: 'bg-danger-soft text-danger' },
}

interface CalloutProps {
  type?: keyof typeof variants
  title?: string
  children: ReactNode
}

/** A bordered card with a coloured edge and an icon tile; the tone carries the meaning. */
export function Callout({ type = 'note', title, children }: CalloutProps) {
  const variant = variants[type]
  const Icon = variant.icon
  return (
    <aside
      className={cn(
        'relative my-6 overflow-hidden rounded-xl border border-line bg-surface py-4 pe-5 ps-6 shadow-card',
        'before:absolute before:inset-y-0 before:start-0 before:w-[3px]',
        variant.edge,
      )}
    >
      <div className="mb-2 flex items-center gap-2.5">
        <span className={cn('inline-flex size-7 shrink-0 items-center justify-center rounded-lg', variant.tile)}>
          <Icon size={15} aria-hidden />
        </span>
        <span className="font-display font-semibold text-ink">{title ?? variant.label()}</span>
      </div>
      <div className="text-[0.96em] [&>*+*]:mt-3">{children}</div>
    </aside>
  )
}
