import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/utils'

/**
 * Global pixel click animation.
 *
 * Inspired by 21st.dev's "ClickTriggerParticles" (jatin-yadav05): a burst of
 * particles radiating from the click point with automatic cleanup. Re-built
 * here as a single canvas so every click on the page is covered at ~zero
 * DOM cost, and the particles are square, grid-snapped "pixels" in the
 * meadow palette to match the retro theme.
 *
 * Call `burst(x, y, { big: true })` to trigger a larger honey burst (e.g. on
 * add-to-cart).
 */

const COLORS = ['#f5b700', '#ffd84d', '#7bc043', '#e8483c', '#6ec6f5', '#ffffff', '#ff8fa3']
const GRID = 2

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  max: number
  gravity: number
}

type BurstOptions = { big?: boolean; colors?: string[] }

const listeners = new Set<(x: number, y: number, opts: BurstOptions) => void>()

export function burst(x: number, y: number, opts: BurstOptions = {}) {
  listeners.forEach((fn) => fn(x, y, opts))
}

export function burstFromElement(el: Element | null, opts: BurstOptions = {}) {
  if (!el) return
  const r = el.getBoundingClientRect()
  burst(r.left + r.width / 2, r.top + r.height / 2, opts)
}

export function ClickSparks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    let raf = 0
    let last = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = (x: number, y: number, opts: BurstOptions) => {
      const palette = opts.colors ?? COLORS
      const count = opts.big ? 26 : 12
      for (let i = 0; i < count; i++) {
        // Even ring + jitter so every burst reads as a deliberate "spark".
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
        const speed = (opts.big ? 260 : 170) * (0.55 + Math.random() * 0.6)
        const max = (opts.big ? 0.7 : 0.45) + Math.random() * 0.2
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (opts.big ? 90 : 30),
          size: (Math.random() < 0.35 ? 6 : 4) * (opts.big ? 1.25 : 1),
          color: palette[Math.floor(Math.random() * palette.length)],
          life: 0,
          max,
          gravity: opts.big ? 620 : 380,
        })
      }
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles = particles.filter((p) => p.life < p.max)
      for (const p of particles) {
        p.life += dt
        p.vx *= 0.9
        p.vy = p.vy * 0.9 + p.gravity * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        const t = p.life / p.max
        // Shrink in discrete steps — reads as frame-based, like old sprites.
        const step = t < 0.5 ? 1 : t < 0.8 ? 0.66 : 0.4
        const s = Math.max(2, Math.round((p.size * step) / GRID) * GRID)
        const sx = Math.round(p.x / GRID) * GRID - s / 2
        const sy = Math.round(p.y / GRID) * GRID - s / 2
        ctx.fillStyle = p.color
        ctx.fillRect(sx, sy, s, s)
      }

      if (particles.length) {
        raf = requestAnimationFrame(tick)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        raf = 0
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      const target = e.target as HTMLElement | null
      // Skip text fields — sparks over a caret feel noisy.
      if (target?.closest('input, textarea, select, [data-no-sparks]')) return
      spawn(e.clientX, e.clientY, {})
    }

    listeners.add(spawn)
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    return () => {
      listeners.delete(spawn)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[120] h-full w-full"
    />
  )
}
