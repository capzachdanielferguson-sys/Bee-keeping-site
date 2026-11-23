/**
 * Real-time "8-bit" treatment for the hero video: draws the current frame
 * into a low-resolution canvas (object-fit: cover math), and optionally
 * remaps every pixel to a 16-color meadow palette with 4×4 Bayer ordered
 * dithering — the look of a 16-bit console cut-scene.
 */

const PALETTE_HEX = [
  '#17200f', '#173d1f', '#2e7d32', '#7bc043', '#b8e07a', '#fbf3d8', '#ffffff', '#f5b700',
  '#ffd84d', '#d98e04', '#e8483c', '#ff8fa3', '#9b7be0', '#6ec6f5', '#1f5f8f', '#a3dcf9',
]
const PALETTE = PALETTE_HEX.map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)])

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v / 16 - 0.5) * 40)

let LUT: Uint8Array | null = null

/** 15-bit RGB → nearest palette index lookup table (built once, lazily). */
function getLut() {
  if (LUT) return LUT
  LUT = new Uint8Array(32 * 32 * 32)
  for (let r = 0; r < 32; r++) {
    for (let g = 0; g < 32; g++) {
      for (let b = 0; b < 32; b++) {
        const R = r * 8 + 4
        const G = g * 8 + 4
        const B = b * 8 + 4
        let best = 0
        let bestD = Infinity
        for (let i = 0; i < PALETTE.length; i++) {
          const p = PALETTE[i]
          // Weighted distance — greens/yellows read closer to how eyes see them.
          const dr = R - p[0]
          const dg = G - p[1]
          const db = B - p[2]
          const d = dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11
          if (d < bestD) {
            bestD = d
            best = i
          }
        }
        LUT[(r << 10) | (g << 5) | b] = best
      }
    }
  }
  return LUT
}

export type FrameSource = HTMLVideoElement | HTMLImageElement

function sourceSize(src: FrameSource) {
  if (src instanceof HTMLVideoElement) return { w: src.videoWidth, h: src.videoHeight }
  return { w: src.naturalWidth, h: src.naturalHeight }
}

/**
 * Render `src` into `canvas` at 1/`block` of the display size.
 * Returns false if the frame could not be drawn yet.
 */
export function renderPixelFrame(
  canvas: HTMLCanvasElement,
  src: FrameSource,
  displayW: number,
  displayH: number,
  block: number,
  quantize: boolean,
): boolean {
  const { w: vw, h: vh } = sourceSize(src)
  if (!vw || !vh) return false
  const cw = Math.max(1, Math.ceil(displayW / block))
  const ch = Math.max(1, Math.ceil(displayH / block))
  if (canvas.width !== cw) canvas.width = cw
  if (canvas.height !== ch) canvas.height = ch
  const ctx = canvas.getContext('2d', { willReadFrequently: quantize })
  if (!ctx) return false
  ctx.imageSmoothingEnabled = true

  // object-fit: cover crop.
  const scale = Math.max(cw / vw, ch / vh)
  const sw = cw / scale
  const sh = ch / scale
  const sx = (vw - sw) / 2
  const sy = (vh - sh) / 2
  ctx.drawImage(src, sx, sy, sw, sh, 0, 0, cw, ch)

  if (!quantize) return true

  try {
    const img = ctx.getImageData(0, 0, cw, ch)
    const d = img.data
    const lut = getLut()
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        const i = (y * cw + x) * 4
        const t = BAYER4[(y & 3) * 4 + (x & 3)]
        const r = Math.min(255, Math.max(0, d[i] + t)) >> 3
        const g = Math.min(255, Math.max(0, d[i + 1] + t)) >> 3
        const b = Math.min(255, Math.max(0, d[i + 2] + t)) >> 3
        const p = PALETTE[lut[(r << 10) | (g << 5) | b]]
        d[i] = p[0]
        d[i + 1] = p[1]
        d[i + 2] = p[2]
      }
    }
    ctx.putImageData(img, 0, 0)
  } catch {
    // Cross-origin frame without CORS — keep the plain pixelation.
  }
  return true
}
