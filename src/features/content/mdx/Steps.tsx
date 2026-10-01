import { Children, isValidElement, type ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { m } from '@/features/i18n'
import { InlineMarkdown } from './QA'

/**
 * A numbered, connected walkthrough — used for execution traces ("what the
 * engine does, line by line") and multi-step procedures.
 */
export function Steps({ children }: { children: ReactNode }) {
  const steps = Children.toArray(children).filter(isValidElement)
  return (
    <ol className="steps my-7 !list-none !ps-0">
      {steps.map((step, i) => (
        <li key={i} className="relative !mt-0 flex gap-4 pb-6 last:pb-0">
          {/* Connector line between the number badges */}
          {i < steps.length - 1 && (
            <span aria-hidden className="absolute start-[0.9rem] top-8 bottom-0 w-px bg-line-strong" />
          )}
          <span className="relative z-[1] inline-flex size-[1.85rem] shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface font-mono text-[12px] font-semibold text-ink shadow-card">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">{step}</div>
        </li>
      ))}
    </ol>
  )
}

export function Step({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="[&>*+*]:mt-3">
      {title && (
        <p className="font-display !mt-0 font-semibold text-ink">
          <InlineMarkdown text={title} />
        </p>
      )}
      {children}
    </div>
  )
}

/** End-of-chapter takeaways: a markdown list rendered as a checklist card. */
export function Recap({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="recap my-7 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <header className="flex items-center gap-2.5 border-b border-line bg-surface-2/70 px-5 py-3">
        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-ok-soft text-ok">
          <CheckCircle2 size={15} aria-hidden />
        </span>
        <span className="font-display font-semibold text-ink">{title ?? m.recap_title()}</span>
      </header>
      <div className="px-5 py-4 [&_li+li]:mt-2.5 [&_ul]:m-0 [&_ul]:list-none [&_ul]:ps-0">{children}</div>
    </section>
  )
}
