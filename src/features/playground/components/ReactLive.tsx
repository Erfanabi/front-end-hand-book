import { lazy, Suspense, useDeferredValue, useEffect, useRef, useState } from 'react'
import { RefreshCw, RotateCcw } from 'lucide-react'
import { m } from '@/features/i18n'
import { useInView } from '@/shared/hooks/useInView'
import type { LogLine } from '../runner/useCodeRunner'
import { ConsoleOutput } from './ConsoleOutput'
import { Toolbar, ToolButton } from './Toolbar'

const CodeEditor = lazy(() => import('./CodeEditor'))

type Lang = 'jsx' | 'tsx'

/**
 * Built by `build/react-runtime-plugin.ts`: React (dev build), react-dom, zustand, react-query.
 * A sandboxed (opaque-origin) frame can't load it with <script src> — the browser
 * blocks both the URL and a blob: URL — so the page fetches it once and hands
 * the source to each frame over postMessage, where it is evaluated (~15ms).
 */
let runtimeSource: Promise<string> | undefined
const loadRuntime = () =>
  (runtimeSource ??= fetch(`${import.meta.env.BASE_URL}react-runtime.js`).then((r) => {
    if (!r.ok) throw new Error(`React runtime failed to load (${r.status})`)
    return r.text()
  }))

/** JSX/TS → CommonJS, so `import { useState } from 'react'` becomes a `require` the runtime resolves. */
async function compile(code: string, lang: Lang) {
  const { transform } = await import('sucrase')
  return transform(code, {
    transforms: lang === 'tsx' ? ['jsx', 'typescript', 'imports'] : ['jsx', 'imports'],
    jsxRuntime: 'automatic',
    production: true,
  }).code
}

/** JSON inside an inline <script>: escape `<` so user code can never close the tag. */
const inlineJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c')

// Always LTR: demo UIs are written in English, and the prose refers to "left"/"right" in them.
const frame = (compiled: string, strict: boolean) => `<!doctype html>
<html dir="ltr"><head><meta charset="utf-8"><style>
  :root { color-scheme: light; font-family: system-ui, Tahoma, sans-serif; font-size: 15px; }
  body { margin: 14px; color: #161a22; line-height: 1.5; }
  button { font: inherit; padding: 5px 12px; border: 1px solid #c9ced8; border-radius: 8px; background: #fff; cursor: pointer; }
  button:hover { border-color: #8b93a3; }
  input, select, textarea { font: inherit; padding: 5px 8px; border: 1px solid #c9ced8; border-radius: 8px; }
  #__error { margin: 8px 0 0; padding: 10px 12px; border-radius: 8px; background: #fde8e8; color: #a11; white-space: pre-wrap; font-size: 13px; }
</style></head>
<body><div id="root"></div><script>
addEventListener('message', function boot(e) {
  if (e.source !== parent || !e.data || e.data.source !== 'react-live-runtime') return
  removeEventListener('message', boot)
  ;(0, eval)(e.data.code)
  __reactLive.run(${inlineJson(compiled)}, { strict: ${strict} })
})
parent.postMessage({ source: 'react-live', type: 'ready' }, '*')
</script></body></html>`

interface ReactLiveProps {
  /** Raw source from a ```jsx live``` fence. Export a default component to render it. */
  code: string
  lang?: Lang
  /** `off` for ```jsx live nostrict```: render without <StrictMode>. */
  strict?: 'off'
}

/**
 * Editable React component with a live preview in a sandboxed iframe (opaque
 * origin: no access to this page, its storage or cookies). Console output from
 * the demo, including React's own dev warnings, is shown underneath.
 */
export function ReactLive({ code, lang = 'jsx', strict: strictMode }: ReactLiveProps) {
  const strict = strictMode !== 'off'
  const [source, setSource] = useState(code)
  const deferred = useDeferredValue(source)
  const [srcDoc, setSrcDoc] = useState('')
  const [run, setRun] = useState(0)
  const [logs, setLogs] = useState<LogLine[]>([])
  const [height, setHeight] = useState(160)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const { ref, inView } = useInView<HTMLDivElement>()

  useEffect(() => {
    if (!inView) return
    let cancelled = false
    const timer = setTimeout(() => {
      compile(deferred, lang).then(
        (compiled) => {
          if (cancelled) return
          setLogs([])
          setSrcDoc(frame(compiled, strict))
        },
        (error: Error) => !cancelled && setLogs([{ level: 'error', text: error.message }]),
      )
    }, 350)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [deferred, lang, strict, inView])

  useEffect(() => {
    const onMessage = ({ source: from, data }: MessageEvent) => {
      const frameWindow = frameRef.current?.contentWindow
      if (!frameWindow || from !== frameWindow || data?.source !== 'react-live') return
      if (data.type === 'ready') {
        loadRuntime().then(
          (code) => frameWindow.postMessage({ source: 'react-live-runtime', code }, '*'),
          (error: Error) => setLogs([{ level: 'error', text: error.message }]),
        )
      }
      if (data.type === 'height') setHeight(Math.min(Math.max(data.value, 90), 640))
      if (data.type === 'clear') setLogs([])
      if (data.type === 'log') setLogs((prev) => [...prev.slice(-199), { level: data.level, text: data.text }])
    }
    addEventListener('message', onMessage)
    return () => removeEventListener('message', onMessage)
  }, [])

  const reload = () => {
    setLogs([])
    setRun((n) => n + 1)
  }

  return (
    <figure ref={ref} className="my-7 overflow-hidden rounded-xl border border-line bg-code shadow-card">
      <Toolbar title={`App.${lang} · ${m.live_react_title()}`} kind="jsx">
        {source !== code && (
          <ToolButton icon={<RotateCcw size={14} />} onClick={() => setSource(code)}>
            {m.reset()}
          </ToolButton>
        )}
        <ToolButton icon={<RefreshCw size={14} />} onClick={reload}>
          {m.live_reload()}
        </ToolButton>
      </Toolbar>
      <div className="grid lg:grid-cols-2">
        <div dir="ltr" className="max-h-[480px] overflow-auto border-line scrollbar-thin lg:border-e">
          <Suspense fallback={<pre className="p-4 font-mono text-[13px] text-ink-2">{source}</pre>}>
            {inView ? (
              <CodeEditor value={source} onChange={setSource} language={lang} />
            ) : (
              <pre className="p-4 font-mono text-[13px] text-ink-2">{source}</pre>
            )}
          </Suspense>
        </div>
        <div className="flex flex-col border-t border-line bg-surface-2 lg:border-t-0">
          <div dir="ltr" className="flex h-8 items-center gap-2 border-b border-line px-3">
            <span className="h-4.5 flex-1 rounded-md border border-line bg-surface px-2 font-mono text-[10.5px] leading-4 text-muted">
              localhost:5173
            </span>
            <span className="text-[11px] font-medium text-muted" dir="auto">{m.live_result()}</span>
          </div>
          {srcDoc && (
            <iframe
              key={run}
              ref={frameRef}
              title={m.live_result()}
              sandbox="allow-scripts allow-forms allow-modals"
              srcDoc={srcDoc}
              style={{ height }}
              className="block w-full bg-white"
            />
          )}
        </div>
      </div>
      {logs.length > 0 && <ConsoleOutput logs={logs} status="done" />}
    </figure>
  )
}
