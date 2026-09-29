import { lazy, Suspense, useDeferredValue, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { directionOf, m, useLocale } from '@/features/i18n'
import { useInView } from '@/shared/hooks/useInView'
import { Toolbar, ToolButton } from './Toolbar'

const CodeEditor = lazy(() => import('./CodeEditor'))

const frameBase = (dir: string) => `<html dir="${dir}"><style>
  :root { color-scheme: light; font-family: system-ui, Tahoma, sans-serif; }
  body { margin: 12px; color: #161a22; }
</style>`

/**
 * Editable HTML/CSS with an instant preview, rendered in a sandboxed iframe
 * (scripts allowed, but no access to this page, its storage or cookies).
 */
export function LivePreview({ code, height = 260 }: { code: string; height?: number }) {
  const [source, setSource] = useState(code)
  const deferred = useDeferredValue(source)
  const { ref, inView } = useInView<HTMLDivElement>()
  const dir = directionOf(useLocale())

  return (
    <figure ref={ref} className="my-7 overflow-hidden rounded-xl border border-line bg-code shadow-card">
      <Toolbar title={`index.html · ${m.live_title()}`} kind="html">
        {source !== code && (
          <ToolButton icon={<RotateCcw size={14} />} onClick={() => setSource(code)}>
            {m.reset()}
          </ToolButton>
        )}
      </Toolbar>
      <div className="grid lg:grid-cols-2">
        <div dir="ltr" className="max-h-[420px] overflow-auto border-line scrollbar-thin lg:border-e">
          <Suspense fallback={<pre className="p-4 font-mono text-[13px] text-ink-2">{source}</pre>}>
            {inView ? (
              <CodeEditor value={source} onChange={setSource} language="html" />
            ) : (
              <pre className="p-4 font-mono text-[13px] text-ink-2">{source}</pre>
            )}
          </Suspense>
        </div>
        <div className="flex flex-col border-t border-line bg-surface-2 lg:border-t-0">
          <div dir="ltr" className="flex h-8 items-center gap-2 border-b border-line px-3">
            <span className="h-4.5 flex-1 rounded-md border border-line bg-surface px-2 font-mono text-[10.5px] leading-4 text-muted">
              localhost/preview
            </span>
            <span className="text-[11px] font-medium text-muted" dir="auto">{m.live_result()}</span>
          </div>
          {inView && (
            <iframe
              title={m.live_result()}
              sandbox="allow-scripts allow-forms allow-modals"
              srcDoc={frameBase(dir) + deferred}
              style={{ height }}
              className="block w-full bg-white"
            />
          )}
        </div>
      </div>
    </figure>
  )
}
