import { useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { m, useLocale } from '@/features/i18n'
import { cn } from '@/shared/lib/cn'
import { scenarios } from './scenarios'

function Lane({ title, items, tone, reverse }: { title: string; items: string[]; tone: string; reverse?: boolean }) {
  const list = reverse ? [...items].reverse() : items
  return (
    <div className="flex min-h-36 flex-col rounded-lg border border-line bg-surface">
      <div className="border-b border-line px-3 py-1.5 font-mono text-[11.5px] font-medium text-muted">{title}</div>
      <ul dir="ltr" className={cn('flex flex-1 flex-col gap-1.5 p-2', reverse && 'justify-end')}>
        {list.length === 0 && <li className="m-auto text-xs text-muted/70">{m.el_empty()}</li>}
        {list.map((item, i) => (
          <li key={item + i} className={cn('rounded-md px-2 py-1 font-mono text-[12px]', tone)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-ink-2 transition-colors hover:text-ink disabled:cursor-default disabled:opacity-40"
    >
      {children}
    </button>
  )
}

/** Step-by-step view of the call stack and both queues for a fixed scenario. */
export function EventLoopViz({ example = 'basic' }: { example?: string }) {
  const locale = useLocale()
  const scenario = scenarios[example]
  const [index, setIndex] = useState(0)
  if (!scenario) return null

  const step = scenario.steps[index]
  const last = scenario.steps.length - 1
  const lines = scenario.code.split('\n')

  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-line bg-surface-2/50 shadow-card">
      <div className="grid gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <pre dir="ltr" className="overflow-x-auto rounded-lg border border-line bg-code py-2 font-mono text-[12.5px] leading-6 scrollbar-thin">
          {lines.map((text, i) => (
            <div
              key={i}
              className={cn(
                'flex gap-3 px-3 transition-colors',
                step.line === i ? 'bg-accent-soft text-ink' : 'text-ink-2',
              )}
            >
              <span className="w-4 shrink-0 select-none text-end text-muted/70">{i + 1}</span>
              <span className="whitespace-pre">{text}</span>
            </div>
          ))}
        </pre>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Lane title={m.el_call_stack()} items={step.stack} tone="bg-accent text-accent-ink" reverse />
          <Lane title={m.el_web_apis()} items={step.webApis} tone="bg-surface-2 text-ink" />
          <Lane title={m.el_microtasks()} items={step.micro} tone="bg-ok-soft text-ok" />
          <Lane title={m.el_tasks()} items={step.tasks} tone="bg-warn-soft text-warn" />
        </div>
      </div>

      <div className="grid gap-3 border-t border-line bg-surface p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="text-[15px] leading-7 text-ink-2" aria-live="polite">{step.note[locale]}</p>
        <div className="flex items-center gap-2">
          <span className="me-2 whitespace-nowrap text-xs text-muted">
            {m.el_step({ current: index + 1, total: last + 1 })}
          </span>
          <StepButton label={m.el_restart()} onClick={() => setIndex(0)}>
            <RotateCcw size={15} />
          </StepButton>
          <StepButton label={m.el_prev()} onClick={() => setIndex((i) => i - 1)} disabled={index === 0}>
            <ChevronLeft size={17} className="rtl:rotate-180" />
          </StepButton>
          <StepButton label={m.el_next()} onClick={() => setIndex((i) => i + 1)} disabled={index === last}>
            <ChevronRight size={17} className="rtl:rotate-180" />
          </StepButton>
        </div>
      </div>

      <div dir="ltr" className="flex flex-wrap items-center gap-2 border-t border-line bg-code px-3 py-2 font-mono text-[12.5px]">
        <span className="text-muted">{m.el_console()} ›</span>
        {step.console.map((out, i) => (
          <span key={i} className="rounded bg-surface px-1.5 text-ink">
            {out}
          </span>
        ))}
      </div>
    </figure>
  )
}
