import type { ReactNode } from 'react'

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-surface px-1.5 font-mono text-[11px] leading-5 text-muted">
      {children}
    </kbd>
  )
}
