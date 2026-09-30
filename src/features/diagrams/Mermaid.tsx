import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Maximize2, Minus, Plus, Scan, X } from 'lucide-react'
import { m } from '@/features/i18n'
import { useTheme } from '@/features/theme'
import { useInView } from '@/shared/hooks/useInView'
import { cn } from '@/shared/lib/cn'
import { fitScale, usePanZoom, type Size } from './usePanZoom'

type MermaidApi = typeof import('mermaid').default

let mermaidPromise: Promise<MermaidApi> | undefined
/** Mermaid is large; it is downloaded once, the first time a diagram scrolls into view. */
const loadMermaid = () => (mermaidPromise ??= import('mermaid').then((mod) => mod.default))

/**
 * Mermaid's render() shares global state (config, a temporary DOM node), so
 * many diagrams rendering at once can clobber each other. Every render goes
 * through this queue, one at a time.
 */
let queue: Promise<unknown> = Promise.resolve()
function enqueue<T>(job: () => Promise<T>): Promise<T> {
  const run = queue.then(job, job)
  queue = run.catch(() => undefined)
  return run
}

const palettes = {
  light: {
    primaryColor: '#ffffff',
    primaryBorderColor: '#3c414b',
    primaryTextColor: '#0f1115',
    secondaryColor: '#f6f7f8',
    tertiaryColor: '#ffffff',
    lineColor: '#6b717d',
    textColor: '#0f1115',
    mainBkg: '#ffffff',
    nodeBorder: '#3c414b',
    clusterBkg: '#f6f7f8',
    clusterBorder: '#d5d8de',
    edgeLabelBackground: '#ffffff',
    noteBkgColor: '#fcf2e3',
    noteBorderColor: '#e2b77a',
    actorBkg: '#ffffff',
    actorBorder: '#3c414b',
    signalColor: '#3c414b',
  },
  dark: {
    primaryColor: '#1b1d24',
    primaryBorderColor: '#7d8392',
    primaryTextColor: '#f2f3f5',
    secondaryColor: '#1f2027',
    tertiaryColor: '#111216',
    lineColor: '#9ca2b0',
    textColor: '#f3f4f7',
    mainBkg: '#1b1d24',
    nodeBorder: '#7d8392',
    clusterBkg: '#171920',
    clusterBorder: '#3e4250',
    edgeLabelBackground: '#14161b',
    noteBkgColor: '#2a1f12',
    noteBorderColor: '#7a5524',
    actorBkg: '#1b1d24',
    actorBorder: '#7d8392',
    signalColor: '#c3c6ce',
  },
}

interface Rendered {
  svg: string
  size: Size
}

/** Gives the SVG explicit pixel dimensions (its natural size) so we control scaling ourselves. */
function normalize(svg: string): Rendered {
  // Mermaid's markup contains HTML (e.g. <br> in labels), so it is not valid XML:
  // only the opening <svg> tag is rewritten, as a string.
  const open = /<svg\b[^>]*>/.exec(svg)?.[0] ?? '<svg>'
  const viewBox = /viewBox="([^"]+)"/.exec(open)?.[1] ?? ''
  const [, , w = 400, h = 200] = viewBox.split(/[\s,]+/).map(Number)
  const tag = open
    .replace(/\s(width|height)="[^"]*"/g, '')
    .replace(/\sstyle="[^"]*"/, '')
    .replace(/^<svg/, `<svg width="${w}" height="${h}" style="max-width:none"`)
  return { svg: svg.replace(open, tag), size: { w, h } }
}

const INLINE_MAX_H = 560
const INLINE_PAD = 20

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-active hover:text-ink"
    >
      {children}
    </button>
  )
}

function Controls({
  zoom,
  onIn,
  onOut,
  onFit,
  extra,
}: {
  zoom: number
  onIn: () => void
  onOut: () => void
  onFit: () => void
  extra?: ReactNode
}) {
  return (
    <div dir="ltr" className="flex items-center gap-0.5 rounded-lg border border-line bg-surface p-0.5">
      <ToolbarButton label={m.diagram_zoom_out()} onClick={onOut}>
        <Minus size={14} />
      </ToolbarButton>
      <span className="w-11 text-center font-mono text-[11px] text-ink-2 tabular-nums">{Math.round(zoom * 100)}%</span>
      <ToolbarButton label={m.diagram_zoom_in()} onClick={onIn}>
        <Plus size={14} />
      </ToolbarButton>
      <span className="mx-0.5 h-4 w-px bg-line" />
      <ToolbarButton label={m.diagram_fit()} onClick={onFit}>
        <Scan size={14} />
      </ToolbarButton>
      {extra}
    </div>
  )
}

/** The pannable/zoomable surface. Used inline and inside the fullscreen dialog. */
function Stage({
  rendered,
  inline,
  onExpand,
}: {
  rendered: Rendered
  inline: boolean
  onExpand?: () => void
}) {
  const { viewportRef, box, view, zoomIn, zoomOut, reset, handlers } = usePanZoom(rendered.size, {
    wheelNeedsModifier: inline,
    cap: inline ? 1 : 1.6,
  })

  // Inline height follows the diagram: fit to width, but never taller than INLINE_MAX_H.
  let height: number | undefined
  let cramped = false
  if (inline) {
    const width = box?.w ?? 700
    const k = fitScale({ w: width, h: INLINE_MAX_H }, rendered.size, INLINE_PAD)
    height = Math.max(160, Math.round(rendered.size.h * Math.min(k, 1) + INLINE_PAD * 2))
    cramped = k < 0.72
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === '+' || e.key === '=') zoomIn()
    else if (e.key === '-') zoomOut()
    else if (e.key === '0') reset()
    else return
    e.preventDefault()
  }

  return (
    <div className={cn('flex flex-col', !inline && 'min-h-0 flex-1')}>
      <div
        ref={viewportRef}
        tabIndex={0}
        role="img"
        aria-label={m.diagram_title()}
        onKeyDown={onKeyDown}
        {...handlers}
        style={{ height }}
        className={cn(
          'diagram-canvas relative cursor-grab overflow-hidden outline-none select-none active:cursor-grabbing',
          inline ? 'touch-pan-y' : 'min-h-0 flex-1 touch-none',
        )}
      >
        {view && (
          <div
            className="absolute top-0 origin-top-left"
            style={{
              width: rendered.size.w,
              height: rendered.size.h,
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
              left: 0,
              right: 'auto',
            }}
            dangerouslySetInnerHTML={{ __html: rendered.svg }}
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-line bg-surface-2/60 px-2 py-1.5" dir="ltr">
        <span className="hidden px-1 text-[11px] text-muted sm:inline" dir="auto">
          {inline ? m.diagram_hint() : m.diagram_hint_full()}
        </span>
        <div className="ms-auto flex items-center gap-2">
          {inline && cramped && onExpand && (
            <button
              type="button"
              onClick={onExpand}
              className="inline-flex h-7.5 cursor-pointer items-center gap-1.5 rounded-lg bg-strong px-2.5 text-[12px] font-medium text-strong-ink"
            >
              <Maximize2 size={13} />
              <span dir="auto">{m.diagram_fullscreen()}</span>
            </button>
          )}
          <Controls
            zoom={view?.k ?? 1}
            onIn={zoomIn}
            onOut={zoomOut}
            onFit={reset}
            extra={
              inline && onExpand ? (
                <ToolbarButton label={m.diagram_fullscreen()} onClick={onExpand}>
                  <Maximize2 size={14} />
                </ToolbarButton>
              ) : undefined
            }
          />
        </div>
      </div>
    </div>
  )
}

function Fullscreen({ rendered, open, onClose }: { rendered: Rendered; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={m.diagram_title()}
      className="m-0 size-full max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/50 backdrop:backdrop-blur-[2px] sm:p-4"
    >
      {open && (
        <div className="flex size-full flex-col overflow-hidden bg-surface sm:rounded-2xl sm:border sm:border-line sm:shadow-pop">
          <div className="flex h-12 shrink-0 items-center gap-3 border-b border-line px-4">
            <span className="font-semibold text-ink">{m.diagram_title()}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label={m.diagram_close()}
              title={m.diagram_close()}
              className="ms-auto inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-line text-ink-2 hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <Stage rendered={rendered} inline={false} />
          </div>
        </div>
      )}
    </dialog>
  )
}

export function Mermaid({ chart }: { chart: string }) {
  const { theme } = useTheme()
  const { ref, inView } = useInView<HTMLElement>('600px')
  const id = 'mmd' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const [rendered, setRendered] = useState<Rendered | null>(null)
  const [failed, setFailed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!inView) return
    let cancelled = false
    enqueue(async () => {
      if (cancelled) return
      const mermaid = await loadMermaid()
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'strict',
        fontFamily: 'Geist Variable, Vazirmatn Variable, sans-serif',
        themeVariables: { ...palettes[theme], fontSize: '15px' },
        flowchart: { useMaxWidth: false, curve: 'basis', padding: 12 },
        sequence: { useMaxWidth: false },
        state: { useMaxWidth: false },
        class: { useMaxWidth: false },
      })
      const result = await mermaid.render(`${id}-${theme}`, chart)
      if (!cancelled) setRendered(normalize(result.svg))
    }).catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [chart, id, inView, theme])

  return (
    <figure
      ref={ref}
      data-diagram
      dir="ltr"
      className="not-prose my-7 overflow-hidden rounded-xl border border-line bg-surface"
    >
      {failed ? (
        <pre className="p-4 text-sm text-muted">{chart}</pre>
      ) : rendered ? (
        <>
          <Stage rendered={rendered} inline onExpand={() => setExpanded(true)} />
          <Fullscreen rendered={rendered} open={expanded} onClose={() => setExpanded(false)} />
        </>
      ) : (
        <div className="diagram-canvas flex h-40 items-center justify-center">
          <span className="text-sm text-muted" dir="auto">
            {m.diagram_loading()}
          </span>
        </div>
      )}
    </figure>
  )
}
