import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useInView } from 'motion/react'
import { ArrowRight, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Accordion } from '@/components/ui/accordion'
import { ProductCard } from '@/components/product/ProductCard'
import { PixelScene } from '@/components/pixel/PixelScenery'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { BEE_TOP, FLOWER_DAISY, HEART, HONEY_DROP, SPARKLE } from '@/components/pixel/sprites'
import { burstFromElement } from '@/components/pixel/ClickSparks'
import { CATEGORIES, PRODUCTS, STARTER_DISCOUNT, STARTER_IDS, getProduct, getProductById, type CategoryId } from '@/data/products'
import { STARTER_FAQ } from '@/data/faq'
import { useCart } from '@/store/cart'
import { asset, cn, formatPrice } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  tone = 'ink',
}: {
  eyebrow: string
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
  tone?: 'ink' | 'cream'
}) {
  return (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl">
        <p className={cn('font-pixel text-xs', tone === 'ink' ? 'text-honey-deep' : 'text-honey')}>{eyebrow}</p>
        <h2 className={cn('mt-3 text-[clamp(2rem,1.2rem+2.6vw,3.4rem)] font-semibold', tone === 'ink' ? 'text-ink' : 'text-cream')}>
          {title}
        </h2>
        {description && (
          <p className={cn('mt-4 text-lg leading-relaxed', tone === 'ink' ? 'text-ink-soft' : 'text-cream/75')}>{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Marquee band
 * ------------------------------------------------------------------ */

const TICKER = [
  'Free US shipping over $99',
  `Starter Quest: ${STARTER_DISCOUNT * 100}% off the five essentials`,
  '2-year hive warranty',
  '30-day returns',
  'Ships in 1–2 business days',
  'Real keepers on the help line',
]

export function Marquee() {
  const items = [...TICKER, ...TICKER]
  return (
    <div id="after-hero" className="relative overflow-hidden border-y-4 border-ink bg-honey py-3" aria-label="Store promises">
      <ul className="flex w-max animate-marquee gap-10 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2">
        {items.map((t, i) => (
          <li key={i} className="font-pixel flex shrink-0 items-center gap-10 text-xs text-ink sm:text-sm" aria-hidden={i >= TICKER.length}>
            {t}
            <PixelSprite sprite={SPARKLE} scale={2} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Starter Quest — pixel landscape + quest log
 * ------------------------------------------------------------------ */

export function StarterQuestSection() {
  const { lines, addMany, open } = useCart()
  const starters = STARTER_IDS.map((id) => getProductById(id)!)
  const full = starters.reduce((s, p) => s + p.price, 0)
  const save = Math.round(full * STARTER_DISCOUNT)
  const owned = (id: string) => lines.some((l) => l.productId === id)
  const missing = STARTER_IDS.filter((id) => !owned(id))
  const btnRef = useRef<HTMLButtonElement | null>(null)

  return (
    <section aria-labelledby="quest-title" className="mx-auto max-w-[1400px] px-3 pt-20 sm:px-6 sm:pt-28 lg:px-10">
      <div className="px-shadow">
        <div className="px-frame px-notch-2">
          <PixelScene className="px-fill px-notch-2 min-h-[640px]" seed={9} bees={4} meadowGround="#173d1f">
            <div className="grid gap-8 p-4 pb-32 sm:p-8 sm:pb-36 lg:grid-cols-[minmax(0,520px)_1fr] lg:p-12 lg:pb-40">
              <div className="px-shadow">
                <div className="px-frame px-notch-2">
                  <div className="px-fill px-notch-2 bg-paper p-6 sm:p-8">
                    <p className="font-pixel text-xs text-honey-deep">Quest log · Season one</p>
                    <h2 id="quest-title" className="mt-3 text-[clamp(2rem,1.3rem+2.2vw,3rem)] font-semibold">
                      Five pieces. One first season.
                    </h2>
                    <p className="mt-3 text-ink-soft">
                      Everything you need for your first colony, and nothing you don’t. Collect all five and we take{' '}
                      {STARTER_DISCOUNT * 100}% off the set automatically.
                    </p>
                    <ol className="mt-6 space-y-2.5">
                      {starters.map((p, i) => {
                        const have = owned(p.id)
                        return (
                          <li key={p.id}>
                            <Link
                              to={`/product/${p.slug}`}
                              className="group flex items-center gap-3 border-2 border-transparent p-1 pr-2 transition-colors hover:border-ink hover:bg-cream"
                            >
                              <span
                                className={cn(
                                  'grid size-7 shrink-0 place-items-center border-2 border-ink',
                                  have ? 'bg-leaf' : 'bg-paper',
                                )}
                                aria-hidden="true"
                              >
                                {have ? <Check className="size-4" strokeWidth={3} /> : <span className="font-pixel text-[0.6rem]">{i + 1}</span>}
                              </span>
                              <img src={asset(p.image)} alt="" className="size-11 shrink-0 bg-card object-cover" loading="lazy" />
                              <span className="min-w-0 flex-1 truncate font-semibold">
                                {p.name}
                                {have && <span className="sr-only"> (in your cart)</span>}
                              </span>
                              <span className="tabular font-bold text-ink-soft">{formatPrice(p.price)}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ol>
                    <div className="mt-6 flex flex-col gap-3 border-t-2 border-dashed border-ink/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-ink-soft">
                        <span className="tabular text-ink line-through decoration-2">{formatPrice(full)}</span>{' '}
                        <strong className="tabular text-xl text-ink">{formatPrice(full - save)}</strong>
                        <span className="ml-2 font-semibold text-meadow">save {formatPrice(save)}</span>
                      </p>
                      <Button
                        ref={btnRef}
                        onClick={() => {
                          if (missing.length === 0) {
                            open()
                            return
                          }
                          addMany(missing)
                          burstFromElement(btnRef.current, { big: true })
                          open()
                        }}
                      >
                        {missing.length === 0
                          ? 'Quest complete — view cart'
                          : missing.length === STARTER_IDS.length
                            ? 'Add all five'
                            : `Add the missing ${missing.length}`}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden items-end justify-end lg:flex">
                <div className="font-pixel scanlines max-w-[260px] bg-ink/80 p-4 text-xs leading-relaxed text-cream">
                  <p className="text-honey">Tip</p>
                  <p className="mt-2 normal-case tracking-normal" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>
                    Order your gear in late winter so it’s assembled and waiting when your bees arrive in spring.
                  </p>
                </div>
              </div>
            </div>
          </PixelScene>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Product showcase — the whole shop on one page
 * ------------------------------------------------------------------ */

export function ProductShowcase() {
  const [cat, setCat] = useState<CategoryId | 'all'>('all')
  const items = useMemo(() => (cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)), [cat])
  const chips: { id: CategoryId | 'all'; label: string }[] = [{ id: 'all', label: 'All' }, ...CATEGORIES]

  return (
    <section aria-labelledby="shop-title" className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 sm:pt-32 lg:px-10">
      <SectionHeading
        eyebrow={`Inventory · ${PRODUCTS.length} items`}
        title={<span id="shop-title">Ten pieces. No filler.</span>}
        description="We only stock gear we’d hand to a friend on their first hive day — tested over real seasons, built to be repaired, priced fairly."
        action={
          <Button asChild variant="paper">
            <Link to="/shop">
              Open the shop <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />
      <div className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="Filter by category">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            aria-pressed={cat === c.id}
            className={cn(
              'h-10 shrink-0 border-2 border-ink px-4 text-sm font-bold transition-colors',
              cat === c.id ? 'bg-ink text-cream' : 'bg-paper text-ink hover:bg-honey/30',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      {/* Bento: on the full view the Starter Hive (top-left) and HiveSense
          (bottom-right) take 2×2 tiles, so ten products fill a clean 4×4 grid. */}
      <motion.div layout className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-flow-dense xl:grid-cols-4">
        {items.map((p, i) => {
          const large = cat === 'all' && (i === 0 || i === items.length - 1)
          return (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i, 6) * 0.03 }}
              className={cn(
                large && 'sm:col-span-2 xl:row-span-2',
                large && i !== 0 && 'xl:col-start-3 xl:row-start-3',
              )}
            >
              <ProductCard product={p} size={large ? 'large' : 'default'} />
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * HiveSense — a pixel dashboard that "reads" a nectar flow
 * ------------------------------------------------------------------ */

// Two weeks of hive weight (lb): a nectar flow begins on day 6.
const WEIGHT = [92.1, 92.4, 92.2, 92.6, 92.9, 93.4, 95.0, 97.1, 99.6, 101.8, 104.9, 107.3, 109.2, 111.6]

export function HiveSenseSection() {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const hs = getProduct('hivesense-monitor')!
  const min = 90
  const max = 112
  const gain = (WEIGHT[WEIGHT.length - 1] - WEIGHT[0]).toFixed(1)

  return (
    <section aria-labelledby="hs-title" className="mt-24 bg-ink text-cream sm:mt-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-10 lg:py-28">
        <div>
          <SectionHeading
            tone="cream"
            eyebrow="New · HiveSense"
            title={<span id="hs-title">Know what’s happening inside — without lifting the lid.</span>}
            description="A scale plate under the hive and a sensor pod between the frames. Watch a nectar flow start, catch a swarm the hour it leaves, and know your winter stores are holding."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ['±0.1 lb', 'Hive scale accuracy'],
              ['15 min', 'Logging interval'],
              ['12 months', 'Per pair of AAs'],
              ['Bluetooth', 'No Wi-Fi needed at the hive'],
            ].map(([k, v]) => (
              <li key={k} className="border-l-4 border-honey bg-cream/5 px-4 py-3">
                <p className="font-display text-2xl font-semibold text-honey-light">{k}</p>
                <p className="text-sm text-cream/70">{v}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="btn-px--onDark">
              <Link to={`/product/${hs.slug}`}>Meet HiveSense · {formatPrice(hs.price)}</Link>
            </Button>
            <p className="text-sm text-cream/60">Works with any Langstroth hive.</p>
          </div>
        </div>

        {/* Pixel dashboard */}
        <div ref={ref} className="relative">
          <div className="px-frame px-notch-2" style={{ '--frame': '#f5b700' } as React.CSSProperties}>
            <div className="px-fill px-notch-2 scanlines bg-[#0f1709] p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <p className="font-pixel text-xs text-honey">Hive 01 · Back meadow</p>
                <p className="font-pixel flex items-center gap-2 text-[0.65rem] text-leaf">
                  <span className="size-2 animate-blink bg-leaf" aria-hidden="true" /> Synced
                </p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ['Weight', `${WEIGHT[WEIGHT.length - 1]} lb`, `+${gain} lb / 14d`],
                  ['Brood temp', '94.3°F', 'Stable'],
                  ['Humidity', '61%', 'Normal'],
                ].map(([k, v, d]) => (
                  <div key={k} className="border-2 border-cream/15 p-3">
                    <p className="font-pixel text-[0.55rem] text-cream/60 sm:text-[0.6rem]">{k}</p>
                    <p className="tabular mt-1 font-display text-xl font-semibold text-cream sm:text-2xl">{v}</p>
                    <p className="font-pixel mt-1 text-[0.55rem] text-leaf sm:text-[0.6rem]">{d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-2 border-cream/15 p-4">
                <div className="flex items-baseline justify-between">
                  <p className="font-pixel text-[0.6rem] text-cream/70">Hive weight · last 14 days</p>
                  <p className="font-pixel text-[0.6rem] text-honey">Nectar flow detected</p>
                </div>
                <div
                  className="mt-4 flex h-44 items-end gap-1.5 sm:gap-2"
                  role="img"
                  aria-label={`Bar chart: hive weight rose from ${WEIGHT[0]} pounds to ${WEIGHT[WEIGHT.length - 1]} pounds over 14 days, with a nectar flow starting on day 7.`}
                >
                  {WEIGHT.map((w, i) => {
                    const h = ((w - min) / (max - min)) * 100
                    return (
                      <motion.span
                        key={i}
                        className={cn('relative flex-1', i >= 6 ? 'bg-honey' : 'bg-leaf/70')}
                        initial={{ height: '4%' }}
                        animate={{ height: inView ? `${h}%` : '4%' }}
                        transition={{ duration: 0.5, delay: inView ? i * 0.06 : 0, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span className="absolute inset-x-0 top-0 h-1 bg-white/60" />
                      </motion.span>
                    )
                  })}
                </div>
                <div className="font-pixel mt-2 flex justify-between text-[0.55rem] text-cream/50">
                  <span>Day 1</span>
                  <span>Day 7</span>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Story / values
 * ------------------------------------------------------------------ */

const VALUES = [
  {
    sprite: FLOWER_DAISY,
    title: 'Bee-safe by default',
    body: 'Beeswax finishes, food-grade steel, no paints or treatments near the brood. If it touches the hive, it’s safe for the colony.',
  },
  {
    sprite: HONEY_DROP,
    title: 'Built to be repaired',
    body: 'Standard sizes, replaceable parts and real warranties — 2 years on hives and extractors. Gear should outlive your first queen.',
  },
  {
    sprite: HEART,
    title: 'Help from real keepers',
    body: 'Questions about your first inspection? Our help line is staffed by people who keep bees, not a script.',
  },
]

export function StorySection() {
  return (
    <section aria-labelledby="story-title" className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 sm:pt-32 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div className="relative">
          <div className="px-notch-2 overflow-hidden bg-card">
            <img
              src={asset('media/beekeeper.jpg')}
              alt="A beekeeper in a white vented jacket lifts a frame of honeycomb from a cedar hive in a wildflower meadow"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="px-shadow absolute -bottom-6 -right-2 sm:-right-6">
            <div className="px-frame px-notch">
              <div className="px-fill px-notch flex items-center gap-3 bg-honey px-4 py-3">
                <PixelSprite sprite={BEE_TOP} scale={3} />
                <p className="font-pixel text-[0.65rem] leading-tight text-ink">
                  Field-tested
                  <br />
                  every season
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="Why yourstripes"
            title={<span id="story-title">Made for your first season — and your fiftieth.</span>}
            description="We started yourstripes after one too many beginner kits with flimsy veils, pine that warped by August and tools that bent on the first stuck frame. So we kept the list short and made every piece the one we’d buy again."
          />
          <ul className="mt-10 space-y-6">
            {VALUES.map((v) => (
              <li key={v.title} className="flex gap-5">
                <span className="px-notch grid size-14 shrink-0 place-items-center bg-wax" aria-hidden="true">
                  <PixelSprite sprite={v.sprite} scale={4} />
                </span>
                <div>
                  <h3 className="font-sans text-lg font-bold tracking-normal">{v.title}</h3>
                  <p className="mt-1 text-ink-soft">{v.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button asChild variant="paper" className="mt-10">
            <Link to="/about">
              Read our story <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Beginner FAQ
 * ------------------------------------------------------------------ */

export function BeginnerFaq() {
  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 sm:pt-32 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="New to bees?"
            title={<span id="faq-title">Start here.</span>}
            description="The questions every new keeper asks before their first hive day — answered by people who’ve made the mistakes already."
          />
          <div className="relative mt-10 hidden overflow-hidden lg:block">
            <img src={asset('media/honeycomb.jpg')} alt="Honeybees walking across golden capped honeycomb" loading="lazy" className="px-notch-2 aspect-[4/3] w-full object-cover" />
          </div>
        </div>
        <div>
          <Accordion items={STARTER_FAQ} defaultOpen={0} />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild variant="paper">
              <Link to="/faq">
                All questions <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Link to="/contact" className="font-semibold text-ink underline decoration-2 underline-offset-4 hover:decoration-honey">
              Ask a keeper
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
