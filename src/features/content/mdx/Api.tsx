import type { ReactNode } from 'react'
import { ArrowRightLeft, CornerDownLeft, ShieldCheck, TriangleAlert } from 'lucide-react'
import { m } from '@/features/i18n'
import { cn } from '@/shared/lib/cn'
import { InlineMarkdown } from './QA'

interface ApiProps {
  /** e.g. `Array.prototype.reduce()` */
  name: string
  /** One-line call signature, e.g. `arr.reduce(callback, initialValue?)` */
  sig: string
  /** What the call evaluates to. Supports `inline code`. */
  returns: string
  /** Does it change the object it's called on? */
  mutates?: 'yes' | 'no' | 'n/a'
  /** Parameters, written as a markdown list in MDX. */
  children?: ReactNode
}

/**
 * API anatomy card: signature, parameters, return value and whether the call
 * mutates. Used for every built-in method so each one is explained the same way.
 */
export function Api({ name, sig, returns, mutates = 'n/a', children }: ApiProps) {
  return (
    <section className="my-6 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <header dir="ltr" className="flex flex-wrap items-center gap-2 border-b border-line bg-surface-2/70 px-4 py-2.5">
        <code className="!border-0 !bg-transparent !p-0 font-mono text-[14px] font-semibold text-ink">{name}</code>
        {mutates !== 'n/a' && (
          <span
            className={cn(
              'ms-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
              mutates === 'yes' ? 'bg-danger-soft text-danger' : 'bg-ok-soft text-ok',
            )}
            dir="auto"
          >
            {mutates === 'yes' ? <TriangleAlert size={12} /> : <ShieldCheck size={12} />}
            {mutates === 'yes' ? m.api_mutates_yes() : m.api_mutates_no()}
          </span>
        )}
      </header>

      <div dir="ltr" className="border-b border-line bg-code px-4 py-2.5 font-mono text-[13px] text-ink">
        {sig}
      </div>

      <div className="grid gap-0 sm:grid-cols-[9rem_minmax(0,1fr)]">
        {children && (
          <>
            <div className="flex items-start gap-1.5 border-b border-line px-4 pt-3 text-[12.5px] font-semibold text-muted sm:border-b-0 sm:pb-3">
              <ArrowRightLeft size={13} className="mt-1 shrink-0" />
              {m.api_params()}
            </div>
            <div className="api-params min-w-0 border-b border-line px-4 py-3 text-[0.95em] sm:border-s [&_li+li]:mt-1.5 [&_ul]:m-0 [&_ul]:ps-4">
              {children}
            </div>
          </>
        )}
        <div className="flex items-start gap-1.5 px-4 pt-3 text-[12.5px] font-semibold text-muted sm:pb-3">
          <CornerDownLeft size={13} className="mt-1 shrink-0 rtl:-scale-x-100" />
          {m.api_returns()}
        </div>
        <div className="min-w-0 px-4 pb-3 pt-1 text-[0.95em] text-ink sm:border-s sm:border-line sm:pt-3">
          <InlineMarkdown text={returns} />
        </div>
      </div>
    </section>
  )
}
