import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'

export interface Size {
  w: number
  h: number
}

interface View {
  x: number
  y: number
  k: number
}

const MIN_K = 0.15
const MAX_K = 5
const clamp = (k: number) => Math.min(MAX_K, Math.max(MIN_K, k))

/** Scale that fits `content` inside `box` with some breathing room, never upscaling past `cap`. */
export const fitScale = (box: Size, content: Size, pad = 24, cap = 1) =>
  Math.min(cap, (box.w - pad * 2) / content.w, (box.h - pad * 2) / content.h)

/**
 * Pan & zoom for a fixed-size piece of content inside a viewport element.
 * - drag (mouse, pen or one finger) pans
 * - wheel zooms around the cursor (optionally only while Ctrl/⌘ is held)
 * - two fingers pinch-zoom
 */
export function usePanZoom(content: Size | null, { wheelNeedsModifier = false, cap = 1 } = {}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<Size | null>(null)
  const [view, setView] = useState<View | null>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ dist: number; k: number } | null>(null)
  const touched = useRef(false)

  useLayoutEffect(() => {
    const node = viewportRef.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setBox({ w: width, h: height })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const fit = useCallback(() => {
    if (!box || !content) return
    const k = fitScale(box, content, 20, cap)
    setView({ k, x: (box.w - content.w * k) / 2, y: (box.h - content.h * k) / 2 })
  }, [box, content, cap])

  // Re-fit whenever the viewport or the content changes size, unless the user has moved things.
  useEffect(() => {
    if (!touched.current) fit()
  }, [fit])

  const zoomAt = useCallback((px: number, py: number, factor: number) => {
    touched.current = true
    setView((v) => {
      if (!v) return v
      const k = clamp(v.k * factor)
      const ratio = k / v.k
      return { k, x: px - (px - v.x) * ratio, y: py - (py - v.y) * ratio }
    })
  }, [])

  const zoomCenter = useCallback(
    (factor: number) => box && zoomAt(box.w / 2, box.h / 2, factor),
    [box, zoomAt],
  )

  const reset = useCallback(() => {
    touched.current = false
    fit()
  }, [fit])

  // Native, non-passive wheel listener so preventDefault works.
  useEffect(() => {
    const node = viewportRef.current
    if (!node) return
    const onWheel = (e: WheelEvent) => {
      if (wheelNeedsModifier && !(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      const rect = node.getBoundingClientRect()
      const factor = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0022))
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, factor)
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [wheelNeedsModifier, zoomAt])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), k: view?.k ?? 1 }
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId)
    if (!prev) return
    const next = { x: e.clientX, y: e.clientY }
    pointers.current.set(e.pointerId, next)
    touched.current = true

    if (pointers.current.size === 2 && pinch.current && view) {
      const [a, b] = [...pointers.current.values()]
      const rect = e.currentTarget.getBoundingClientRect()
      const target = clamp(pinch.current.k * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.dist))
      zoomAt((a.x + b.x) / 2 - rect.left, (a.y + b.y) / 2 - rect.top, target / view.k)
      return
    }
    setView((v) => (v ? { ...v, x: v.x + next.x - prev.x, y: v.y + next.y - prev.y } : v))
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinch.current = null
  }

  return {
    viewportRef,
    box,
    view,
    zoomIn: () => zoomCenter(1.25),
    zoomOut: () => zoomCenter(0.8),
    reset,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onDoubleClick: (e: ReactMouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        zoomAt(e.clientX - rect.left, e.clientY - rect.top, 1.6)
      },
    },
  }
}
