import { useEffect, useRef, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export interface PixelCanvasProps {
  /** CSS pixels per art pixel. */
  scale?: number
  /** Called with a canvas sized to (container / scale). Must be deterministic. */
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
  className?: string
  style?: CSSProperties
  /** Bump to force a redraw when draw inputs change. */
  version?: string | number
}

/**
 * A low-resolution canvas stretched to fill its container with nearest-
 * neighbour scaling, so procedural art stays perfectly crisp at any size.
 */
export function PixelCanvas({ scale = 4, draw, className, style, version }: PixelCanvasProps) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    let lastW = 0
    let lastH = 0
    const render = () => {
      const rect = parent.getBoundingClientRect()
      const w = Math.max(1, Math.ceil(rect.width / scale))
      const h = Math.max(1, Math.ceil(rect.height / scale))
      if (w === lastW && h === lastH) return
      lastW = w
      lastH = h
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.imageSmoothingEnabled = false
      drawRef.current(ctx, w, h)
    }

    render()
    const ro = new ResizeObserver(render)
    ro.observe(parent)
    return () => ro.disconnect()
  }, [scale, version])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn('pixelated pointer-events-none absolute inset-0 h-full w-full', className)}
      style={style}
    />
  )
}
