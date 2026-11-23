import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, ShieldCheck, Truck, RotateCcw, PackageCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ProductCard, SelectCursor } from '@/components/product/ProductCard'
import { StatBar } from '@/components/pixel/StatBar'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { SPARKLE } from '@/components/pixel/sprites'
import { renderPixelFrame } from '@/components/pixel/pixelate'
import { SectionHeading } from '@/components/home/sections'
import { PRODUCTS, STARTER_DISCOUNT, categoryLabel, getProduct } from '@/data/products'
import { useAddToCart, useDocumentTitle } from '@/lib/hooks'
import { asset, cn, formatPrice } from '@/lib/utils'
import NotFound from './NotFound'

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [eightBit, setEightBit] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!eightBit) return
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return
    const draw = () => {
      const r = img.getBoundingClientRect()
      renderPixelFrame(canvas, img, r.width, r.height, Math.max(6, Math.round(r.width / 96)), true)
    }
    if (img.complete) draw()
    else img.addEventListener('load', draw, { once: true })
  }, [eightBit, src])

  return (
    <div className="group relative">
      <SelectCursor />
      <div className="px-notch-2 relative overflow-hidden bg-card">
        <img ref={imgRef} src={asset(src)} alt={alt} className="aspect-square w-full object-cover" />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={cn('pixelated absolute inset-0 h-full w-full transition-opacity duration-200', eightBit ? 'opacity-100' : 'opacity-0')}
        />
      </div>
      <button
        type="button"
        onClick={() => setEightBit((v) => !v)}
        aria-pressed={eightBit}
        className={cn(
          'font-pixel absolute bottom-4 left-4 flex h-9 items-center gap-2 px-3 text-[0.65rem] transition-colors',
          eightBit ? 'bg-honey text-ink' : 'bg-ink/80 text-cream hover:bg-ink',
        )}
      >
        <PixelSprite sprite={SPARKLE} scale={2} />
        8-bit view {eightBit ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)
  useDocumentTitle(product?.name ?? 'Not found')
  const addToCart = useAddToCart()
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const addRef = useRef<HTMLButtonElement | null>(null)

  if (!product) return <NotFound />

  const related = [
    ...PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category),
    ...PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category && p.starter),
    ...PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category && !p.starter),
  ].slice(0, 4)

  const onAdd = () => {
    if (product.sizes && !size) {
      setSizeError(true)
      return
    }
    addToCart(product, { size: size ?? undefined, qty, source: addRef.current })
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: asset(product.image),
    brand: { '@type': 'Brand', name: 'yourstripes' },
    offers: { '@type': 'Offer', priceCurrency: 'USD', price: product.price, availability: 'https://schema.org/InStock' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-[1400px] px-4 pt-[100px] sm:px-6 sm:pt-[120px] lg:px-10">
        <nav aria-label="Breadcrumb">
          <ol className="font-pixel flex flex-wrap items-center gap-2 text-[0.6rem] text-muted">
            <li>
              <Link to="/" className="hover:text-ink">Home</Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link to="/shop" className="hover:text-ink">Shop</Link>
            </li>
            <li aria-hidden="true">›</li>
            <li>
              <Link to={`/shop?c=${product.category}`} className="hover:text-ink">{categoryLabel(product.category)}</Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="text-ink">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductImage src={product.image} alt={product.imageAlt} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-pixel bg-wax px-2 py-1 text-[0.6rem] text-ink">{categoryLabel(product.category)}</span>
              {product.badge && <span className="font-pixel bg-ink px-2 py-1 text-[0.6rem] text-cream">{product.badge}</span>}
              <span className="font-pixel text-[0.6rem] text-muted">SKU {product.sku}</span>
            </div>
            <h1 className="mt-4 text-[clamp(2.25rem,1.5rem+2.4vw,3.6rem)] font-semibold">{product.name}</h1>
            <p className="mt-3 text-lg text-ink-soft">{product.tagline}</p>
            <p className="tabular mt-5 text-3xl font-extrabold">{formatPrice(product.price)}</p>

            {product.sizes && (
              <fieldset className="mt-7">
                <legend className="flex w-full items-baseline justify-between text-sm font-bold">
                  <span>
                    Size{size ? `: ${size}` : ''}
                  </span>
                  <Link to="/faq#products" className="font-semibold text-ink-soft underline decoration-2 underline-offset-4 hover:decoration-honey">
                    Size guide
                  </Link>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSize(s)
                        setSizeError(false)
                      }}
                      aria-pressed={size === s}
                      className={cn(
                        'h-11 min-w-12 border-2 px-3 text-sm font-bold transition-colors',
                        size === s ? 'border-ink bg-ink text-cream' : 'border-ink/30 bg-paper text-ink hover:border-ink',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {sizeError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="alert"
                      className="mt-2 text-sm font-semibold text-poppy"
                    >
                      Pick a size first — exchanges are free if it’s not right.
                    </motion.p>
                  )}
                </AnimatePresence>
              </fieldset>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-14 items-center border-2 border-ink bg-paper">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-full w-12 place-items-center hover:bg-ink/5"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <span className="tabular w-10 text-center font-bold" aria-live="polite" aria-label={`Quantity ${qty}`}>
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  className="grid h-full w-12 place-items-center hover:bg-ink/5"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <Button ref={addRef} size="lg" className="flex-1" onClick={onAdd}>
                Add to cart · {formatPrice(product.price * qty)}
              </Button>
            </div>

            {product.starter && (
              <p className="mt-4 border-l-4 border-honey bg-honey/15 px-4 py-3 text-sm text-ink-soft">
                <strong className="text-ink">Part of the Starter Quest.</strong> Add all five starter pieces and{' '}
                {STARTER_DISCOUNT * 100}% comes off the set automatically.
              </p>
            )}

            <ul className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
              <li className="flex items-center gap-3">
                <Truck className="size-5 text-meadow" aria-hidden="true" /> Free US shipping over $99
              </li>
              <li className="flex items-center gap-3">
                <PackageCheck className="size-5 text-meadow" aria-hidden="true" /> Ships in 1–2 business days
              </li>
              <li className="flex items-center gap-3">
                <RotateCcw className="size-5 text-meadow" aria-hidden="true" /> 30-day returns
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-meadow" aria-hidden="true" /> {product.warranty}-year warranty
              </li>
            </ul>

            <div className="mt-8 px-shadow-soft">
              <div className="px-frame px-notch">
                <div className="px-fill px-notch bg-paper p-5">
                  <p className="font-pixel text-xs text-ink">Item stats</p>
                  <div className="mt-4 space-y-3">
                    {product.stats.map((s, i) => (
                      <StatBar key={s.label} label={s.label} value={s.value} tone={i === 0 ? 'honey' : i === 1 ? 'leaf' : 'sky'} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-sans text-lg font-bold tracking-normal">About this piece</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{product.description}</p>
              <ul className="mt-5 space-y-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 text-ink-soft">
                    <span className="mt-2 size-2 shrink-0 bg-honey" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="font-sans text-lg font-bold tracking-normal">Specs</h2>
                <dl className="mt-3 divide-y-2 divide-dashed divide-ink/10 border-y-2 border-ink text-sm">
                  {product.specs.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-2.5">
                      <dt className="font-semibold text-muted">{k}</dt>
                      <dd className="text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h2 className="font-sans text-lg font-bold tracking-normal">In the box</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {product.inTheBox.map((b) => (
                    <li key={b} className="flex gap-3 border-b-2 border-dashed border-ink/10 pb-2 text-ink">
                      <span className="font-pixel text-[0.6rem] text-honey-deep" aria-hidden="true">
                        ×
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="related-title" className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 lg:px-10">
        <SectionHeading eyebrow="Pairs well with" title={<span id="related-title">Round out your kit.</span>} />
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  )
}
