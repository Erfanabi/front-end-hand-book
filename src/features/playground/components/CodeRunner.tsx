import { lazy, Suspense, useState, type ReactNode } from 'react'
import { Pencil, Play, RotateCcw, Square } from 'lucide-react'
import { m } from '@/features/i18n'
import { cn } from '@/shared/lib/cn'
import { useCodeRunner } from '../runner/useCodeRunner'
import type { RunMode } from '../runner/workerSource'
import { ConsoleOutput } from './ConsoleOutput'
import { EditingBadge, Toolbar, ToolButton } from './Toolbar'

const CodeEditor = lazy(() => import('./CodeEditor'))

interface CodeRunnerProps {
  /** Raw source, injected by the remark plugin from a ```js run fence. */
  code: string
  /** Build-time highlighted version of the same code (shown until editing). */
  children?: ReactNode
  title?: string
  /** `sloppy` runs as a classic non-strict script instead of an ES module. */
  mode?: RunMode
}

export function CodeRunner({ code, children, title, mode }: CodeRunnerProps) {
  const [source, setSource] = useState(code)
  const [editing, setEditing] = useState(false)
  const { logs, status, run, stop } = useCodeRunner()
  const running = status === 'running'
  const changed = source !== code

  return (
    <figure
      data-runner
      className={cn(
        'my-7 overflow-hidden rounded-xl border bg-code shadow-card transition-shadow',
        editing ? 'border-accent/50 ring-4 ring-accent/10' : 'border-line',
      )}
    >
      <Toolbar
        title={title ?? (mode === 'sloppy' ? 'script.js · sloppy' : 'main.js')}
        status={editing ? <EditingBadge label={m.editing()} /> : undefined}
      >
        {!editing && (
          <ToolButton icon={<Pencil size={14} />} onClick={() => setEditing(true)}>
            {m.edit()}
          </ToolButton>
        )}
        {changed && (
          <ToolButton icon={<RotateCcw size={14} />} onClick={() => setSource(code)}>
            {m.reset()}
          </ToolButton>
        )}
        {running ? (
          <ToolButton icon={<Square size={13} />} onClick={stop}>
            {m.stop()}
          </ToolButton>
        ) : (
          <ToolButton primary icon={<Play size={14} />} onClick={() => run(source, mode)}>
            {m.run()}
          </ToolButton>
        )}
      </Toolbar>

      <div dir="ltr">
        {editing ? (
          <Suspense fallback={<pre className="p-4 font-mono text-[13.5px] text-ink-2">{source}</pre>}>
            <CodeEditor value={source} onChange={setSource} autoFocus />
          </Suspense>
        ) : (
          children
        )}
      </div>

      {status !== 'idle' && <ConsoleOutput logs={logs} status={status} />}
    </figure>
  )
}
