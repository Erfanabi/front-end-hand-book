import { useState } from 'react'
import { m } from '@/features/i18n'
import { CssReadout, RangeControl, SelectControl } from './Controls'
import { Toolbar } from './Toolbar'

const directions = ['row', 'row-reverse', 'column', 'column-reverse'] as const
const justify = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const
const align = ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'] as const
const wraps = ['nowrap', 'wrap', 'wrap-reverse'] as const

const itemSizes = [64, 92, 52, 120, 76, 100, 58, 88]

export function FlexboxPlayground() {
  const [direction, setDirection] = useState<(typeof directions)[number]>('row')
  const [justifyContent, setJustify] = useState<(typeof justify)[number]>('flex-start')
  const [alignItems, setAlign] = useState<(typeof align)[number]>('stretch')
  const [wrap, setWrap] = useState<(typeof wraps)[number]>('nowrap')
  const [gap, setGap] = useState(8)
  const [count, setCount] = useState(4)

  const rules = {
    display: 'flex',
    'flex-direction': direction,
    'justify-content': justifyContent,
    'align-items': alignItems,
    'flex-wrap': wrap,
    gap: `${gap}px`,
  }

  return (
    <figure className="my-7 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
      <Toolbar title="Flexbox Playground" kind="css">{null}</Toolbar>
      <div className="grid gap-3 p-4 sm:grid-cols-3">
        <SelectControl label="flex-direction" value={direction} options={directions} onChange={setDirection} />
        <SelectControl label="justify-content" value={justifyContent} options={justify} onChange={setJustify} />
        <SelectControl label="align-items" value={alignItems} options={align} onChange={setAlign} />
        <SelectControl label="flex-wrap" value={wrap} options={wraps} onChange={setWrap} />
        <RangeControl label="gap" value={gap} min={0} max={32} onChange={setGap} />
        <RangeControl label={m.flex_items()} value={count} min={1} max={8} onChange={setCount} dirLtr={false} />
      </div>
      <div dir="ltr" className="px-4 pb-4">
        <div
          className="h-64 overflow-auto rounded-lg border border-dashed border-accent/50 bg-accent-soft/40 p-2"
          style={{ display: 'flex', flexDirection: direction, justifyContent, alignItems, flexWrap: wrap, gap }}
        >
          {itemSizes.slice(0, count).map((size, i) => (
            <div
              key={i}
              className="flex min-h-10 min-w-10 items-center justify-center rounded-md bg-accent font-mono text-sm font-semibold text-accent-ink"
              style={{ width: direction.startsWith('row') ? size : undefined, height: direction.startsWith('column') ? size / 2 + 16 : undefined, paddingBlock: i % 2 ? 18 : 6 }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <CssReadout selector=".container" rules={rules} />
    </figure>
  )
}
