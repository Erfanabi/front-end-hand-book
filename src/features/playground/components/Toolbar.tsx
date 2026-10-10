import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

const fileBadge: Record<string, { label: string; className: string }> = {
  js: { label: 'JS', className: 'bg-[#f7df1e] text-[#1a1a1a]' },
  html: { label: '<>', className: 'bg-[#e34c26] text-white' },
  jsx: { label: '⚛', className: 'bg-[#20232a] text-[#61dafb]' },
  css: { label: '#', className: 'bg-[#2965f1] text-white' },
  quiz: { label: '?', className: 'bg-strong text-strong-ink' },
  ui: { label: '◧', className: 'bg-accent text-accent-ink' },
}

/**
 * Window bar for every code frame: traffic-light dots, a file tab and actions.
 * `kind` picks the little file badge shown in the tab.
 */
export function Toolbar({
  title,
  kind = 'js',
  status,
  children,
}: {
  title?: ReactNode
  kind?: keyof typeof fileBadge
  status?: ReactNode
  children: ReactNode
}) {
  const badge = fileBadge[kind]
  return (
    <div dir="ltr" className="flex h-11 items-center gap-2 border-b border-line bg-surface ps-3 pe-2">
      <span className="hidden items-center gap-1.5 sm:flex" aria-hidden>
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </span>
      {title && (
        <span className="ms-1 inline-flex h-7 min-w-0 items-center gap-2 rounded-md border border-line bg-surface-2 ps-1 pe-2.5 text-[12px] font-medium text-ink-2 sm:ms-2">
          <span className={cn('inline-flex h-4.5 min-w-4.5 items-center justify-center rounded px-0.5 font-mono text-[9px] font-bold', badge.className)}>
            {badge.label}
          </span>
          <span dir="auto" className="truncate">
            {title}
          </span>
        </span>
      )}
      {status}
      <span className="me-auto" />
      {children}
    </div>
  )
}

interface ToolButtonProps extends ComponentProps<'button'> {
  icon: ReactNode
  primary?: boolean
}

export function ToolButton({ icon, primary, className, children, ...props }: ToolButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-7.5 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium transition-colors disabled:cursor-default disabled:opacity-60',
        primary
          ? 'bg-strong text-strong-ink shadow-card hover:opacity-90'
          : 'border border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink',
        className,
      )}
      {...props}
    >
      {icon}
      <span dir="auto">{children}</span>
    </button>
  )
}

/** Small pill shown next to the file tab while the code is being edited. */
export function EditingBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
      <span className="size-1.5 animate-pulse rounded-full bg-accent" />
      <span dir="auto">{label}</span>
    </span>
  )
}
