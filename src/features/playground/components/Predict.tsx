import { useState, type ReactNode } from 'react'
import { Eye, EyeOff, Play } from 'lucide-react'
import { m } from '@/features/i18n'
import { useCodeRunner } from '../runner/useCodeRunner'
import type { RunMode } from '../runner/workerSource'
import { ConsoleOutput } from './ConsoleOutput'
import { Toolbar, ToolButton } from './Toolbar'

interface PredictProps {
  code: string
  output: string
  mode?: RunMode
  children?: ReactNode
}

/** "Predict the output" — think first, reveal the expected output, then run it for real. */
export function Predict({ code, output, mode, children }: PredictProps) {
  const [revealed, setRevealed] = useState(false)
  const { logs, status, run } = useCodeRunner()

  return (
    <figure data-runner className="my-7 overflow-hidden rounded-xl border border-line bg-code shadow-card">
      <Toolbar title={m.predict_title()} kind="quiz">
        <ToolButton
          icon={revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          onClick={() => setRevealed((v) => !v)}
          aria-expanded={revealed}
        >
          {revealed ? m.predict_hide() : m.predict_show()}
        </ToolButton>
        <ToolButton primary icon={<Play size={14} />} onClick={() => run(code, mode)} disabled={status === 'running'}>
          {m.run()}
        </ToolButton>
      </Toolbar>

      <div dir="ltr">{children}</div>

      {revealed && (
        <div className="border-t border-line bg-ok-soft/70 px-4 py-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ok">
            <span className="size-1.5 rounded-full bg-ok" />
            {m.predict_output()}
          </div>
          <pre dir="ltr" className="whitespace-pre-wrap font-mono text-[13px] leading-6 text-ink">
            {output}
          </pre>
        </div>
      )}

      {status !== 'idle' && <ConsoleOutput logs={logs} status={status} />}
    </figure>
  )
}
