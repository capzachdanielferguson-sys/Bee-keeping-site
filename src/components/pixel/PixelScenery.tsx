import { useCallback, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { PixelCanvas } from './PixelCanvas'
import { PixelSprite } from './PixelSprite'
import { drawMeadow, drawScene } from './meadow'
import { BEE_SIDE_A, BEE_SIDE_B, CLOUD, CLOUD_SMALL } from './sprites'

/* ------------------------------------------------------------------ *
 * PixelMeadow — a strip of pixel grass + flowers.
 * ------------------------------------------------------------------ */

export function PixelMeadow({
  className,
  ground = '#173d1f',
  seed = 7,
  scale = 4,
  density = 0.55,
  heightPx = 104,
  style,
}: {
  className?: string
  ground?: string | null
  seed?: number
  scale?: number
  density?: number
  heightPx?: number
  style?: CSSProperties
}) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) =>
      drawMeadow(ctx, { width: w, height: h, seed, ground, flowerDensity: density }),
    [seed, ground, density],
  )
  return (
    <div aria-hidden="true" className={cn('pointer-events-none relative w-full', className)} style={{ height: heightPx, ...style }}>
      <PixelCanvas scale={scale} draw={draw} version={`${seed}-${ground}-${density}`} />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * FlyingBee — a two-frame sprite that crosses its container.
 * Uses container query units so travel distance matches the parent width.
 * ------------------------------------------------------------------ */

export interface FlyingBeeProps {
  top: string
  duration: number
  delay?: number
  scale?: number
  reverse?: boolean
}

export function FlyingBee({ top, duration, delay = 0, scale = 3, reverse = false }: FlyingBeeProps) {
  return (
    <div
      className="ys-flyer absolute left-0"
      style={
        {
          top,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        } as CSSProperties
      }
    >
      <div className="animate-bob" style={{ transform: reverse ? 'scaleX(-1)' : undefined }}>
        <div className="relative" style={{ transform: reverse ? 'scaleX(-1)' : undefined }}>
          <PixelSprite sprite={BEE_SIDE_A} scale={scale} className="animate-wing" />
          <PixelSprite sprite={BEE_SIDE_B} scale={scale} className="absolute inset-0 animate-wing [animation-delay:-0.09s]" />
        </div>
      </div>
    </div>
  )
}

/** A layer of bees drifting across a section. */
export function PixelBees({
  count = 3,
  className,
  seed = 1,
  scale = 3,
}: {
  count?: number
  className?: string
  seed?: number
  scale?: number
}) {
  const bees = Array.from({ length: count }, (_, i) => {
    const r = Math.sin((i + 1) * 999 * seed) * 10000
    const f = r - Math.floor(r)
    return {
      top: `${12 + ((i * 37 + f * 40) % 70)}%`,
      duration: 16 + ((i * 7 + f * 10) % 14),
      delay: -((i * 5.3 + f * 9) % 20),
      reverse: i % 2 === 1,
    }
  })
  return (
    <div aria-hidden="true" className={cn('ys-flyers pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {bees.map((b, i) => (
        <FlyingBee key={i} {...b} scale={scale} />
      ))}
    </div>
  )
}

/** Clouds drifting slowly across a sky. */
export function PixelClouds({ className, scale = 4 }: { className?: string; scale?: number }) {
  return (
    <div aria-hidden="true" className={cn('ys-flyers pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="ys-flyer absolute" style={{ top: '8%', animationDuration: '90s', animationDelay: '-30s' }}>
        <PixelSprite sprite={CLOUD} scale={scale} />
      </div>
      <div className="ys-flyer absolute" style={{ top: '22%', animationDuration: '120s', animationDelay: '-85s' }}>
        <PixelSprite sprite={CLOUD_SMALL} scale={scale} />
      </div>
      <div className="ys-flyer absolute" style={{ top: '4%', animationDuration: '140s', animationDelay: '-10s' }}>
        <PixelSprite sprite={CLOUD_SMALL} scale={scale - 1} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * PixelScene — a full pixel landscape: sky, sun, hills, meadow, bees.
 * ------------------------------------------------------------------ */

export function PixelScene({
  className,
  seed = 3,
  scale = 4,
  bees = 3,
  meadowGround = '#173d1f',
  children,
}: {
  className?: string
  seed?: number
  scale?: number
  bees?: number
  meadowGround?: string | null
  children?: React.ReactNode
}) {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => drawScene(ctx, { width: w, height: h, seed }),
    [seed],
  )
  return (
    <div className={cn('relative isolate overflow-hidden bg-sky', className)}>
      <PixelCanvas scale={scale} draw={draw} version={seed} />
      <PixelClouds scale={scale} />
      <PixelBees count={bees} seed={seed} scale={Math.max(2, scale - 1)} />
      <PixelMeadow className="absolute inset-x-0 bottom-0" ground={meadowGround} seed={seed + 11} scale={scale} />
      <div className="relative">{children}</div>
    </div>
  )
}
