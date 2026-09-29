import { useId } from 'react'

interface SelectControlProps<T extends string> {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}

export function SelectControl<T extends string>({ label, value, options, onChange }: SelectControlProps<T>) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} dir="ltr" className="text-start font-mono text-[11.5px] text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        dir="ltr"
        className="h-9 cursor-pointer rounded-md border border-line bg-surface px-2 font-mono text-[13px] text-ink"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

interface RangeControlProps {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  dirLtr?: boolean
}

export function RangeControl({ label, value, min, max, onChange, dirLtr = true }: RangeControlProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} dir={dirLtr ? 'ltr' : undefined} className="text-start font-mono text-[11.5px] text-muted">
        {label}: <span className="text-ink">{value}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 cursor-pointer accent-[var(--accent)]"
      />
    </div>
  )
}

/** Shows the CSS the controls produce, so readers connect the knobs to real code. */
export function CssReadout({ selector, rules }: { selector: string; rules: Record<string, string> }) {
  const body = Object.entries(rules)
    .map(([prop, val]) => `  ${prop}: ${val};`)
    .join('\n')
  return (
    <pre dir="ltr" className="overflow-x-auto border-t border-line px-4 py-3 font-mono text-[12.5px] leading-6 text-ink-2">
      {`${selector} {\n${body}\n}`}
    </pre>
  )
}
