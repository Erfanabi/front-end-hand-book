import { useEffect, useState, type RefObject } from 'react'
import { m } from '@/features/i18n'
import { cn } from '@/shared/lib/cn'

interface Heading {
  id: string
  text: string
  depth: number
  number: number
}

/**
 * "Table of contents" — built from the rendered article's h2/h3 elements, with
 * a scroll-spy that highlights the section currently being read. Numbers match
 * the badges drawn in front of each h2.
 */
export function Toc({ articleRef, ready }: { articleRef: RefObject<HTMLElement | null>; ready: boolean }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState('')

  useEffect(() => {
    const article = articleRef.current
    if (!article || !ready) return
    const nodes = Array.from(article.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]'))
    let h2 = 0
    setHeadings(
      nodes.map((n) => {
        const depth = n.tagName === 'H2' ? 2 : 3
        if (depth === 2) h2++
        return { id: n.id, text: (n.textContent ?? '').replace(/\s*#$/, ''), depth, number: h2 }
      }),
    )

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -70% 0px' },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [articleRef, ready])

  if (headings.length < 2) return null

  return (
    <nav aria-label={m.on_this_page()} className="text-[13px]">
      <div className="mb-3 px-2 text-[12px] font-medium text-muted">{m.on_this_page()}</div>
      <ul className="space-y-0.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                'flex items-start gap-2.5 rounded-lg py-1.5 leading-5 transition-colors',
                h.depth === 3 ? 'pe-2 ps-9 text-[12.5px]' : 'px-2',
                active === h.id ? 'bg-active font-medium text-ink' : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
              )}
            >
              {h.depth === 2 && (
                <span
                  className={cn(
                    'mt-px inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full border font-mono text-[9.5px] font-semibold',
                    active === h.id ? 'border-strong bg-strong text-strong-ink' : 'border-line-strong text-muted',
                  )}
                >
                  {h.number}
                </span>
              )}
              <span>{h.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
