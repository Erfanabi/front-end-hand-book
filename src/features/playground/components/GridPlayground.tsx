import { useState } from 'react'
import { m } from '@/features/i18n'
import { CssReadout, RangeControl, SelectControl } from './Controls'
import { Toolbar } from './Toolbar'

const templates = [
  'repeat(3, 1fr)',
  '200px 1fr',
  '1fr 2fr 1fr',
  'repeat(auto-fill, minmax(110px, 1fr))',
  'repeat(auto-fit, minmax(110px, 1fr))',
  'minmax(0, 1fr) 120px',
] as const
const autoFlows = ['row', 'column', 'row dense'] as const
const justifyItems = ['stretch', 'start', 'center', 'end'] as const

export function GridPlayground() {
  const [columns, setColumns] = useState<(typeof templates)[number]>('repeat(3, 1fr)')
  const [flow, setFlow] = useState<(typeof autoFlows)[number]>('row')
  const [justify, setJustify] = useState<(typeof justifyItems)[number]>('stretch')
  const [gap, setGap] = useState(8)
  const [count, setCount] = useState(5)
  const [spanFirst, setSpanFirst] = useState(false)

  const rules = {
    display: 'grid',
    'grid-template-columns': columns,
    'grid-auto-flow': flow,
    'justify-items': justify,
    gap: `${gap}px`,
  }

  return (
    <figure className="my-7 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <Toolbar title="Grid Playground" kind="css">{null}</Toolbar>
      <div className="grid gap-3 p-4 sm:grid-cols-3">
        <SelectControl label="grid-template-columns" value={columns} options={templates} onChange={setColumns} />
        <SelectControl label="grid-auto-flow" value={flow} options={autoFlows} onChange={setFlow} />
        <SelectControl label="justify-items" value={justify} options={justifyItems} onChange={setJustify} />
        <RangeControl label="gap" value={gap} min={0} max={32} onChange={setGap} />
        <RangeControl label={m.flex_items()} value={count} min={1} max={12} onChange={setCount} dirLtr={false} />
        <label dir="ltr" className="flex cursor-pointer items-center gap-2 self-end pb-2 font-mono text-[12px] text-ink-2">
          <input type="checkbox" checked={spanFirst} onChange={(e) => setSpanFirst(e.target.checked)} className="accent-[var(--accent)]" />
          .item-1 {'{ grid-column: span 2 }'}
        </label>
      </div>
      <div dir="ltr" className="px-4 pb-4">
        <div
          className="min-h-40 rounded-lg border border-dashed border-accent/50 bg-accent-soft/40 p-2"
          style={{ display: 'grid', gridTemplateColumns: columns, gridAutoFlow: flow, justifyItems: justify, gap }}
        >
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="flex h-14 min-w-12 items-center justify-center rounded-md bg-accent font-mono text-sm font-semibold text-accent-ink"
              style={i === 0 && spanFirst ? { gridColumn: 'span 2' } : undefined}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <CssReadout selector=".grid" rules={rules} />
    </figure>
  )
}
