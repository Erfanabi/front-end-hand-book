import { createContext, use, useRef, type ComponentProps } from 'react'
import { Check, Copy } from 'lucide-react'
import { m } from '@/features/i18n'
import { useCopy } from '@/shared/hooks/useCopy'

/** Code inside a runner/predict frame renders without its own frame. */
export const BareCodeContext = createContext(false)

const languageNames: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  tsx: 'TSX',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  bash: 'Shell',
  http: 'HTTP',
  text: '',
  diagram: 'Diagram',
  output: 'Output',
}

type PreProps = ComponentProps<'pre'> & { 'data-lang'?: string }

/** Framed code block: line-number gutter, language chip and an always-visible Copy button. */
export function CodeBlock({ 'data-lang': lang = 'text', ...props }: PreProps) {
  const bare = use(BareCodeContext)
  const ref = useRef<HTMLPreElement>(null)
  const { copied, copy } = useCopy()

  if (bare) return <pre {...props} />

  const label = languageNames[lang] ?? lang

  return (
    <div dir="ltr" className="code-frame my-6 overflow-hidden rounded-xl border border-line bg-code shadow-card">
      <div className="flex h-10 items-center gap-2 border-b border-line bg-surface-2/80 ps-3 pe-2">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </span>
        {label && <span className="ms-2 font-mono text-[11.5px] font-medium text-muted">{label}</span>}
        <button
          type="button"
          onClick={() => copy(ref.current?.textContent ?? '')}
          aria-label={copied ? m.copied() : m.code_copy_label()}
          className="ms-auto inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-ink-2 transition-colors hover:bg-active hover:text-ink"
        >
          {copied ? <Check size={13} className="text-ok" /> : <Copy size={13} />}
          <span dir="auto">{copied ? m.copied() : m.copy()}</span>
        </button>
      </div>
      <pre ref={ref} {...props} />
    </div>
  )
}
