import { Fragment, type ReactNode } from 'react'
import { CheckCircle2, ChevronDown, CornerDownRight, Microscope, XCircle } from 'lucide-react'
import { m } from '@/features/i18n'
import { cn } from '@/shared/lib/cn'

type Level = 'junior' | 'mid' | 'senior'

const levelStyle: Record<Level, string> = {
  junior: 'bg-ok-soft text-ok',
  mid: 'bg-warn-soft text-warn',
  senior: 'bg-danger-soft text-danger',
}

const levelLabel: Record<Level, () => string> = {
  junior: m.level_junior,
  mid: m.level_mid,
  senior: m.level_senior,
}

/** Renders `inline code` inside plain-string props such as a question title. */
export function InlineMarkdown({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith('`') && part.endsWith('`') ? (
          <code key={i}>{part.slice(1, -1)}</code>
        ) : part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={cn('rounded-md px-2 py-0.5 text-[11.5px] font-semibold', levelStyle[level])} dir="ltr">
      {levelLabel[level]()}
    </span>
  )
}

interface QAProps {
  q: string
  level?: Level
  n?: number
  children: ReactNode
}

/** An interview question card. Collapsed by default so the reader can answer first. */
export function QA({ q, level, n, children }: QAProps) {
  return (
    <details
      data-qa
      className="group my-3 overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-shadow open:border-line-strong open:shadow-pop"
    >
      <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2/70 sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="mt-0.5 inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md bg-strong px-1.5 font-mono text-[11px] font-semibold text-strong-ink">
          {n !== undefined ? `Q${n}` : 'Q'}
        </span>
        <span className="font-display flex-1 font-semibold leading-7 text-ink">
          <InlineMarkdown text={q} />
        </span>
        {level && (
          <span className="mt-0.5 shrink-0">
            <LevelBadge level={level} />
          </span>
        )}
        <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-line text-muted transition-transform group-open:rotate-180">
          <ChevronDown size={15} aria-hidden />
        </span>
      </summary>
      <div className="space-y-3 border-t border-line bg-surface-2/40 px-4 py-4 sm:px-5">{children}</div>
    </details>
  )
}

function Section({ label, icon, tone, children }: { label: string; icon: ReactNode; tone: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-surface px-4 py-3">
      <h5 className={cn('mb-1.5 flex items-center gap-1.5 text-[12.5px] font-semibold', tone)}>
        {icon}
        {label}
      </h5>
      <div className="[&>*+*]:mt-3">{children}</div>
    </section>
  )
}

export const Answer = ({ children }: { children: ReactNode }) => (
  <Section label={m.qa_answer()} icon={<CheckCircle2 size={14} />} tone="text-ok">{children}</Section>
)
export const Deep = ({ children }: { children: ReactNode }) => (
  <Section label={m.qa_deep()} icon={<Microscope size={14} />} tone="text-accent">{children}</Section>
)
export const Mistake = ({ children }: { children: ReactNode }) => (
  <Section label={m.qa_mistake()} icon={<XCircle size={14} />} tone="text-danger">{children}</Section>
)
export const FollowUp = ({ children }: { children: ReactNode }) => (
  <Section label={m.qa_followup()} icon={<CornerDownRight size={14} className="rtl:-scale-x-100" />} tone="text-warn">{children}</Section>
)
