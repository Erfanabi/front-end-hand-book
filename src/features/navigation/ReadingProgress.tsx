import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { m } from '@/features/i18n'
import { cn } from '@/shared/lib/cn'

function useScrollFraction() {
  const [fraction, setFraction] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - innerHeight
      setFraction(max > 0 ? Math.min(1, scrollY / max) : 0)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return fraction
}

/** Thin gradient line under the top bar showing how far through the chapter the reader is. */
export function ReadingProgress() {
  const fraction = useScrollFraction()
  return (
    <div className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 overflow-hidden" aria-hidden>
      <div
        className="h-full origin-left bg-gradient-to-r from-[#7c8cff] via-[#2459e0] to-[#e0447c] rtl:origin-right"
        style={{ transform: `scaleX(${fraction})` }}
      />
    </div>
  )
}

/** Floating "back to top" button, shown after the first screen. */
export function BackToTop() {
  const fraction = useScrollFraction()
  const visible = fraction > 0.08
  return (
    <button
      type="button"
      onClick={() => scrollTo({ top: 0 })}
      aria-label={m.back_to_top()}
      title={m.back_to_top()}
      className={cn(
        'fixed bottom-5 end-5 z-20 inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-pop transition-all hover:text-ink',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <ArrowUp size={17} />
    </button>
  )
}
