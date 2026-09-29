import { AlertTriangle, ChevronRight, Info, SquareTerminal, XCircle } from 'lucide-react'
import { m } from '@/features/i18n'
import { cn } from '@/shared/lib/cn'
import { RUN_TIMEOUT_SECONDS, type LogLine, type RunStatus } from '../runner/useCodeRunner'

const levelStyle: Record<LogLine['level'], { row: string; icon: typeof ChevronRight }> = {
  log: { row: 'text-ink', icon: ChevronRight },
  debug: { row: 'text-muted', icon: ChevronRight },
  info: { row: 'text-accent', icon: Info },
  warn: { row: 'bg-warn-soft text-warn', icon: AlertTriangle },
  error: { row: 'bg-danger-soft text-danger', icon: XCircle },
}

/** Terminal-style output panel under a code frame. */
export function ConsoleOutput({ logs, status }: { logs: LogLine[]; status: RunStatus }) {
  return (
    <div className="border-t border-line bg-surface" aria-live="polite">
      <div className="flex h-8 items-center gap-2 border-b border-line px-3 text-[11.5px] font-medium text-muted">
        <SquareTerminal size={13} aria-hidden />
        <span>{m.console()}</span>
        {status === 'running' && <span className="size-1.5 animate-pulse rounded-full bg-accent" />}
        {logs.length > 0 && <span className="ms-auto font-mono text-[10.5px]">{m.console_lines({ count: logs.length })}</span>}
      </div>
      <div dir="ltr" className="max-h-72 overflow-auto py-1.5 font-mono text-[13px] leading-6 scrollbar-thin">
        {logs.map((line, i) => {
          const { row, icon: Icon } = levelStyle[line.level]
          return (
            <div key={i} className={cn('flex gap-2 border-b border-line/50 px-3 py-0.5 last:border-b-0', row)}>
              <Icon size={13} className="mt-[5px] shrink-0 opacity-60" aria-hidden />
              <span className="min-w-0 whitespace-pre-wrap break-words">{line.text}</span>
            </div>
          )
        })}
        {status === 'done' && logs.length === 0 && (
          <div dir="auto" className="px-3 font-sans text-muted">{m.console_empty()}</div>
        )}
        {status === 'timeout' && (
          <div dir="auto" className="px-3 font-sans text-xs text-muted">
            {m.console_timeout({ seconds: RUN_TIMEOUT_SECONDS })}
          </div>
        )}
      </div>
    </div>
  )
}
