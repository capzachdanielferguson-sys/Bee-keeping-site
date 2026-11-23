/**
 * Hand-authored pixel sprites. Each sprite is a grid of characters; every
 * character maps to a palette color ("." is transparent). Sprites render as
 * crisp SVG (see PixelSprite) or onto canvas (see drawSprite).
 */

export const PALETTE: Record<string, string> = {
  k: '#17200f', // ink
  K: '#3b4230', // soft ink
  y: '#f5b700', // honey
  Y: '#ffd84d', // honey light
  o: '#d98e04', // honey shade
  w: '#ffffff',
  b: '#bfe7fb', // wing tint
  B: '#8fd0f2', // wing shade
  g: '#7bc043', // leaf
  G: '#2e7d32', // meadow
  d: '#173d1f', // deep green
  r: '#e8483c', // poppy
  R: '#b32d24', // poppy shade
  p: '#ff8fa3', // petal pink
  P: '#e0607a', // pink shade
  l: '#9b7be0', // lilac
  L: '#6e52b8', // lilac shade
  s: '#6ec6f5', // sky
  S: '#1f5f8f', // sky deep
  c: '#fbf3d8', // cream
  C: '#d6eefb', // cloud shade
  n: '#a86b2d', // wood
  N: '#7a4a1e', // wood shade
  m: '#9aa3a8', // metal
  M: '#6b7479', // metal shade
}

export type Sprite = readonly string[]

/** Side-view bee facing right — wings up. */
export const BEE_SIDE_A: Sprite = [
  '......kkk.......',
  '.....kbwbk.kkk..',
  '.....kbwbkkbwbk.',
  '......kbbkbwbk..',
  '.......kkkbbk...',
  '....kkkkkkkkk...',
  '...kyykyykkkkk..',
  '..kyYykyYkkkwkk.',
  'kkyyykyykkkkkkk.',
  '..kyyykyykkkkk..',
  '...kkkkkkkkkk...',
  '....k..k..k.....',
]

/** Side-view bee facing right — wings down (second animation frame). */
export const BEE_SIDE_B: Sprite = [
  '................',
  '................',
  '................',
  '................',
  '........kkkk....',
  '....kkkkkbbwbk..',
  '...kyykyykkbbbk.',
  '..kyYykyYkkkwkk.',
  'kkyyykyykkkkkkk.',
  '..kyyykyykkkkk..',
  '...kkkkkkkkkk...',
  '....k..k..k.....',
]

/** Top-down bee used for the logo mark and favicon. */
export const BEE_TOP: Sprite = [
  '..k.....k..',
  '...k...k...',
  '...kkkkk...',
  'bb.kkkkk.bb',
  'bwbkyyykbwb',
  'bwbkkkkkbwb',
  'bbbkyyykbbb',
  '...kkkkk...',
  '...kyyyk...',
  '....kkk....',
  '.....k.....',
]

/** Flower template: P = petal, Q = petal shade, C = center. */
const FLOWER_TEMPLATE: Sprite = [
  '..P.P..',
  '.PPQPP.',
  'PPQCQPP',
  '.PPQPP.',
  '..P.P..',
  '...G...',
  'gg.G...',
  '.gGG.gg',
  '...GGg.',
  '...G...',
]

const TULIP_TEMPLATE: Sprite = [
  '.P.P.P.',
  '.PPPPP.',
  '.PQPQP.',
  '..PPP..',
  '...G...',
  '.g.G.g.',
  '.ggGgg.',
  '...G...',
  '...G...',
]

function recolor(template: Sprite, map: Record<string, string>): Sprite {
  return template.map((row) =>
    row
      .split('')
      .map((ch) => map[ch] ?? ch)
      .join(''),
  )
}

export const FLOWER_DAISY = recolor(FLOWER_TEMPLATE, { P: 'w', Q: 'C', C: 'y' })
export const FLOWER_POPPY = recolor(FLOWER_TEMPLATE, { P: 'r', Q: 'R', C: 'k' })
export const FLOWER_CORN = recolor(FLOWER_TEMPLATE, { P: 's', Q: 'S', C: 'L' })
export const FLOWER_PINK = recolor(FLOWER_TEMPLATE, { P: 'p', Q: 'P', C: 'Y' })
export const FLOWER_BUTTER = recolor(FLOWER_TEMPLATE, { P: 'Y', Q: 'y', C: 'o' })
export const TULIP_LILAC = recolor(TULIP_TEMPLATE, { P: 'l', Q: 'L' })
export const TULIP_RED = recolor(TULIP_TEMPLATE, { P: 'r', Q: 'R' })

export const FLOWERS: Sprite[] = [
  FLOWER_DAISY,
  FLOWER_POPPY,
  FLOWER_CORN,
  FLOWER_PINK,
  TULIP_LILAC,
  FLOWER_BUTTER,
  TULIP_RED,
]

export const CLOUD: Sprite = [
  '.......wwww.........',
  '.....wwwwwwww.......',
  '...wwwwwwwwwwww.ww..',
  '..wwwwwwwwwwwwwwwwww',
  '.wwwwwwwwwwwwwwwwwww',
  'wwwwwwwwwwwwwwwwwwww',
  '.CCCCCCCCCCCCCCCCCC.',
]

export const CLOUD_SMALL: Sprite = [
  '....wwww....',
  '..wwwwwwww..',
  '.wwwwwwwwwww',
  'wwwwwwwwwwww',
  '.CCCCCCCCCC.',
]

export const HEART: Sprite = [
  '.rr.rr.',
  'rwrrrrr',
  'rrrrrrr',
  '.rrrrr.',
  '..rrr..',
  '...r...',
]

export const HEART_EMPTY: Sprite = [
  '.kk.kk.',
  'k..k..k',
  'k.....k',
  '.k...k.',
  '..k.k..',
  '...k...',
]

export const HONEY_DROP: Sprite = [
  '...y...',
  '..yyy..',
  '.yYyyy.',
  'yYyyyyo',
  'yyyyyyo',
  '.yyyoo.',
  '..ooo..',
]

export const SPARKLE: Sprite = [
  '...w...',
  '...w...',
  '..wYw..',
  'wwYyYww',
  '..wYw..',
  '...w...',
  '...w...',
]

export const SUN: Sprite = [
  '....y..y....',
  '.y........y.',
  '...YYYYYY...',
  '..YYYYYYYY..',
  'y.YYYYYYYY.y',
  '..YYYYYYYY..',
  '..YYYYYYYY..',
  'y.YYYYYYYY.y',
  '..YYYYYYYY..',
  '...YYYYYY...',
  '.y........y.',
  '....y..y....',
]

/** A tiny Langstroth hive box — empty states and 404. */
export const HIVE: Sprite = [
  '.mmmmmmmmmmmm.',
  'mMMMMMMMMMMMMm',
  '.nnnnnnnnnnnn.',
  '.nNNNNNNNNNNn.',
  '.nn..nnnn..nn.',
  '.nnnnnnnnnnnn.',
  '.NNNNNNNNNNNN.',
  '.nnnnnnnnnnnn.',
  '.nNNNNNNNNNNn.',
  '.nn..nnnn..nn.',
  '.nnnnnnnnnnnn.',
  'nnnnnkkkknnnnn',
  'NNNNNNNNNNNNNN',
]

export function spriteSize(sprite: Sprite) {
  return { w: Math.max(...sprite.map((r) => r.length)), h: sprite.length }
}

/** Draw a sprite onto a 2D canvas at integer pixel scale. */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
  scale = 1,
  palette: Record<string, string> = PALETTE,
) {
  for (let row = 0; row < sprite.length; row++) {
    const line = sprite[row]
    for (let col = 0; col < line.length; col++) {
      const ch = line[col]
      if (ch === '.' || ch === ' ') continue
      const color = palette[ch]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x + col * scale, y + row * scale, scale, scale)
    }
  }
}
