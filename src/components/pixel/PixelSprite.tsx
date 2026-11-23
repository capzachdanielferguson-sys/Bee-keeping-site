import { memo, useMemo, type CSSProperties } from 'react'
import { PALETTE, spriteSize, type Sprite } from './sprites'

type Run = { x: number; y: number; w: number; color: string }

/** Collapse each row into horizontal color runs → far fewer SVG nodes. */
function toRuns(sprite: Sprite, palette: Record<string, string>): Run[] {
  const runs: Run[] = []
  sprite.forEach((line, y) => {
    let x = 0
    while (x < line.length) {
      const ch = line[x]
      if (ch === '.' || ch === ' ' || !palette[ch]) {
        x++
        continue
      }
      let end = x + 1
      while (end < line.length && line[end] === ch) end++
      runs.push({ x, y, w: end - x, color: palette[ch] })
      x = end
    }
  })
  return runs
}

export interface PixelSpriteProps {
  sprite: Sprite
  /** CSS pixels per sprite pixel. */
  scale?: number
  palette?: Record<string, string>
  className?: string
  style?: CSSProperties
  title?: string
}

/**
 * Renders a character-grid sprite as a crisp SVG. Decorative by default
 * (aria-hidden) unless a title is supplied.
 */
export const PixelSprite = memo(function PixelSprite({
  sprite,
  scale = 4,
  palette = PALETTE,
  className,
  style,
  title,
}: PixelSpriteProps) {
  const { w, h } = spriteSize(sprite)
  const runs = useMemo(() => toRuns(sprite, palette), [sprite, palette])
  return (
    <svg
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {runs.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.color} />
      ))}
    </svg>
  )
})
