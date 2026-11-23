import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { mulberry32 } from './meadow'
import { prefersReducedMotion } from '@/lib/utils'

const COLS = 16
const ROWS = 10
const DURATION = 420

/**
 * Route transition: when the path changes, the new page is revealed through
 * a grid of cream "pixels" that wink out in a random order — a nod to the
 * screen-dissolve wipes of 8/16-bit games. Skipped on first load and for
 * reduced-motion users.
 */
export function PixelDissolve() {
  const { pathname } = useLocation()
  const first = useRef(true)
  const counter = useRef(0)
  const [run, setRun] = useState(0)

  // Layout effect: the overlay must be in place before the new page paints.
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (prefersReducedMotion()) return
    counter.current += 1
    setRun(counter.current)
    const t = window.setTimeout(() => setRun(0), DURATION + 60)
    return () => window.clearTimeout(t)
  }, [pathname])

  const delays = useMemo(() => {
    const rand = mulberry32(run * 97 + 13)
    return Array.from({ length: COLS * ROWS }, () => Math.floor(rand() * (DURATION - 140)))
  }, [run])

  if (!run) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] grid"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
    >
      {delays.map((d, i) => (
        <span
          key={`${run}-${i}`}
          className={i % 11 === 0 ? 'bg-honey' : i % 7 === 0 ? 'bg-wax' : 'bg-cream'}
          style={{
            animation: `ys-block-out 1ms steps(1) ${d}ms forwards`,
          }}
        />
      ))}
    </div>
  )
}
