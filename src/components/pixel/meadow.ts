import { CLOUD, CLOUD_SMALL, FLOWERS, PALETTE, SUN, drawSprite, spriteSize } from './sprites'

/** Small deterministic PRNG so pixel scenery is stable between renders. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface MeadowOptions {
  /** Width/height in sprite pixels. */
  width: number
  height: number
  seed?: number
  /** Solid fill under the grass line (null = transparent). */
  ground?: string | null
  /** 0..1 — how many flowers to scatter. */
  flowerDensity?: number
}

/**
 * Draws a strip of pixel grass with scattered flowers.
 * Ground line sits ~10 px from the bottom; blades and flowers rise above it.
 */
export function drawMeadow(ctx: CanvasRenderingContext2D, opts: MeadowOptions) {
  const { width, height, seed = 7, ground = PALETTE.d, flowerDensity = 0.55 } = opts
  const rand = mulberry32(seed)
  ctx.clearRect(0, 0, width, height)

  const groundTop = height - 10

  // Ground body with a two-tone band.
  if (ground) {
    ctx.fillStyle = PALETTE.G
    ctx.fillRect(0, groundTop, width, 3)
    ctx.fillStyle = ground
    ctx.fillRect(0, groundTop + 3, width, height - groundTop - 3)
  } else {
    ctx.fillStyle = PALETTE.G
    ctx.fillRect(0, groundTop, width, height - groundTop)
  }

  // Back row of short blades (deep).
  for (let x = 0; x < width; x++) {
    const h = 2 + Math.floor(rand() * 4)
    ctx.fillStyle = PALETTE.G
    ctx.fillRect(x, groundTop - h, 1, h)
  }

  // Flowers behind the front blades.
  const minGap = 7
  let x = Math.floor(rand() * 6)
  while (x < width - 7) {
    if (rand() < flowerDensity) {
      const sprite = FLOWERS[Math.floor(rand() * FLOWERS.length)]
      const { h } = spriteSize(sprite)
      const lift = Math.floor(rand() * 4)
      drawSprite(ctx, sprite, x, groundTop - h + 3 - lift, 1)
      x += minGap + Math.floor(rand() * 9)
    } else {
      x += 3 + Math.floor(rand() * 6)
    }
  }

  // Front blades with light tips.
  for (let bx = 0; bx < width; bx += 1) {
    if (rand() < 0.55) continue
    const h = 3 + Math.floor(rand() * 6)
    const lean = rand() < 0.5 ? -1 : 1
    ctx.fillStyle = PALETTE.G
    ctx.fillRect(bx, groundTop - h + 2, 1, h)
    ctx.fillStyle = PALETTE.g
    ctx.fillRect(bx + (h > 6 ? lean : 0), groundTop - h + 1, 1, 2)
  }

  // Speckle highlights along the ground line.
  for (let gx = 0; gx < width; gx += 2 + Math.floor(rand() * 5)) {
    ctx.fillStyle = PALETTE.g
    ctx.fillRect(gx, groundTop + 1, 1, 1)
  }
}

export interface SceneOptions {
  width: number
  height: number
  seed?: number
  sun?: boolean
  /** Draw clouds into the static layer (moving clouds can be DOM sprites instead). */
  clouds?: boolean
}

const SKY_BANDS = ['#5bbcf0', '#6ec6f5', '#86d0f7', '#a3dcf9', '#c3e8fb']

/** Pixel landscape: dithered sky bands, sun, two hill layers. */
export function drawScene(ctx: CanvasRenderingContext2D, opts: SceneOptions) {
  const { width, height, seed = 3, sun = true, clouds = false } = opts
  const rand = mulberry32(seed)
  const horizon = Math.floor(height * 0.62)
  const band = Math.ceil(horizon / SKY_BANDS.length)

  // Sky bands with a checkerboard dither row at each transition.
  SKY_BANDS.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.fillRect(0, i * band, width, band + 1)
    const next = SKY_BANDS[i + 1]
    if (next) {
      ctx.fillStyle = next
      const y = (i + 1) * band - 2
      for (let dx = 0; dx < width; dx++) {
        if (dx % 2 === 0) ctx.fillRect(dx, y, 1, 1)
        else ctx.fillRect(dx, y + 1, 1, 1)
      }
    }
  })

  if (sun) {
    const { w } = spriteSize(SUN)
    drawSprite(ctx, SUN, Math.floor(width * 0.78) - Math.floor(w / 2), Math.floor(horizon * 0.18), 1)
  }

  if (clouds) {
    for (let i = 0; i < Math.max(2, Math.floor(width / 70)); i++) {
      const c = rand() < 0.5 ? CLOUD : CLOUD_SMALL
      drawSprite(ctx, c, Math.floor(rand() * (width - 20)), Math.floor(rand() * horizon * 0.5), 1)
    }
  }

  // Far hills.
  const farColor = '#9fd36a'
  const farShade = '#7bc043'
  const phase = rand() * 10
  for (let x = 0; x < width; x++) {
    const y = Math.floor(horizon - 6 - Math.sin(x / 23 + phase) * 5 - Math.sin(x / 9 + phase * 2) * 1.5)
    ctx.fillStyle = farColor
    ctx.fillRect(x, y, 1, height - y)
    ctx.fillStyle = farShade
    if (x % 3 === 0) ctx.fillRect(x, y + 3, 1, 1)
  }

  // Near hills.
  const nearColor = PALETTE.g
  const nearShade = PALETTE.G
  const phase2 = rand() * 10
  for (let x = 0; x < width; x++) {
    const y = Math.floor(horizon + 6 - Math.sin(x / 31 + phase2) * 7)
    ctx.fillStyle = nearColor
    ctx.fillRect(x, y, 1, height - y)
    ctx.fillStyle = nearShade
    ctx.fillRect(x, y + 6 + ((x * 7) % 3), 1, height)
  }

  // Tiny hedgerow trees along the far hill line.
  for (let i = 0; i < width / 18; i++) {
    const tx = Math.floor(rand() * width)
    const ty = Math.floor(horizon - 6 - Math.sin(tx / 23 + phase) * 5) - 3
    ctx.fillStyle = PALETTE.G
    ctx.fillRect(tx - 1, ty, 3, 3)
    ctx.fillRect(tx, ty - 1, 1, 1)
    ctx.fillStyle = PALETTE.d
    ctx.fillRect(tx, ty + 3, 1, 1)
  }
}
