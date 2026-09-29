import { useState } from 'react'
import { CssReadout, RangeControl, SelectControl } from './Controls'
import { Toolbar } from './Toolbar'

const positions = ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const
const parentPositions = ['static', 'relative'] as const

/**
 * The box is moved with top/left. Switch the parent between static and
 * relative to see how the containing block of an absolute element changes.
 */
export function PositionPlayground() {
  const [position, setPosition] = useState<(typeof positions)[number]>('relative')
  const [parent, setParent] = useState<(typeof parentPositions)[number]>('relative')
  const [top, setTop] = useState(16)
  const [left, setLeft] = useState(24)

  const offsets: Record<string, string> = position === 'static' ? {} : { top: `${top}px`, left: `${left}px` }

  return (
    <figure className="my-7 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <Toolbar title="Position Playground" kind="css">{null}</Toolbar>
      <div className="grid gap-3 p-4 sm:grid-cols-4">
        <SelectControl label=".box position" value={position} options={positions} onChange={setPosition} />
        <SelectControl label=".parent position" value={parent} options={parentPositions} onChange={setParent} />
        <RangeControl label="top" value={top} min={0} max={80} onChange={setTop} />
        <RangeControl label="left" value={left} min={0} max={120} onChange={setLeft} />
      </div>
      <div dir="ltr" className="px-4 pb-4">
        {/* `transform` makes this frame the containing block for position: fixed, keeping the demo inside the card. */}
        <div className="relative h-72 overflow-auto rounded-lg border border-line bg-surface-2 p-3 [transform:translateZ(0)] scrollbar-thin">
          <div className="mb-2 font-mono text-[11px] text-muted">scroll container (transform → contains fixed)</div>
          <div
            className="rounded-lg border-2 border-dashed border-ink-2/40 p-3"
            style={{ position: parent, minHeight: 150 }}
          >
            <div className="font-mono text-[11px] text-muted">.parent (position: {parent})</div>
            <div className="mt-2 h-8 rounded bg-line/70" />
            <div
              className="z-10 flex h-14 w-28 items-center justify-center rounded-md bg-accent font-mono text-xs font-semibold text-accent-ink shadow-card"
              style={{ position, ...offsets }}
            >
              .box
            </div>
            <div className="mt-2 h-8 rounded bg-line/70" />
          </div>
          <div className="mt-3 h-40 rounded bg-line/40" />
        </div>
      </div>
      <CssReadout selector=".box" rules={{ position, ...offsets }} />
    </figure>
  )
}
