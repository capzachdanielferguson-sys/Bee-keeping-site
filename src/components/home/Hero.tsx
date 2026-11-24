import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Pause, Play } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PixelMeadow } from '@/components/pixel/PixelScenery'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { BEE_TOP, HEART, HONEY_DROP, SPARKLE } from '@/components/pixel/sprites'
import { HERO_VIDEO } from '@/data/media'
import { PRODUCTS, getProduct } from '@/data/products'
import { asset, cn, formatPrice, numberWord, prefersReducedMotion } from '@/lib/utils'

const starter = getProduct('meadow-starter-hive')!

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const boxY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const controlsOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])

  // Start playback explicitly (muted, so every browser allows autoplay), and
  // respect reduced motion by staying paused on the poster frame.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    if (prefersReducedMotion()) {
      v.pause()
      setPaused(true)
      return
    }
    const tryPlay = () => void v.play().catch(() => undefined)
    tryPlay()
    v.addEventListener('canplay', tryPlay)
    return () => v.removeEventListener('canplay', tryPlay)
  }, [])

  const togglePause = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      void v.play().catch(() => undefined)
      setPaused(false)
    } else {
      v.pause()
      setPaused(true)
    }
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-meadow pb-[76px] pt-[50svh] sm:pb-[96px] lg:block lg:h-[100svh] lg:max-h-[1080px] lg:min-h-[680px] lg:bg-sky lg:p-0"
    >
      {/* Poster first (LCP), video fades in once frames arrive. */}
      <img
        src={asset(HERO_VIDEO.poster)}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-x-0 top-0 -z-20 h-[66svh] w-full max-w-none object-cover object-[60%_50%] lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:w-[128%] lg:max-w-none lg:object-center"
      />
      <video
        ref={videoRef}
        className={cn(
          'absolute inset-x-0 top-0 -z-10 h-[66svh] w-full max-w-none object-cover object-[60%_50%] transition-opacity duration-700 lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:w-[128%] lg:max-w-none lg:object-center',
          playing ? 'opacity-100' : 'opacity-0',
        )}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={asset(HERO_VIDEO.poster)}
        onPlaying={() => setPlaying(true)}
        aria-hidden="true"
        tabIndex={-1}
      >
        {/* Best available first; the bundled 540p loop always works, even where
            the CDN is unreachable (sandboxed previews, strict networks). */}
        <source src={asset(HERO_VIDEO.desktop.local)} type="video/mp4" media="(min-width: 900px)" />
        <source src={HERO_VIDEO.desktop.cdn} type="video/mp4" media="(min-width: 900px)" />
        <source src={asset(HERO_VIDEO.mobile.local)} type="video/mp4" />
        <source src={HERO_VIDEO.mobile.cdn} type="video/mp4" />
        <source src={asset(HERO_VIDEO.bundled)} type="video/mp4" />
      </video>

      {/* Gentle grade so the header and headline box sit comfortably over a bright sky. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-[4] h-[66svh] bg-[linear-gradient(180deg,rgb(23_32_15/0.28)_0%,transparent_22%,transparent_70%,rgb(46_125_50/0.9)_100%)] lg:inset-0 lg:h-full lg:bg-[linear-gradient(180deg,rgb(23_32_15/0.28)_0%,transparent_22%,transparent_60%,rgb(23_32_15/0.35)_100%)]" />

      {/* Pause / play — moving video must be stoppable (WCAG 2.2.2). */}
      <motion.button
        type="button"
        style={{ opacity: controlsOpacity }}
        onClick={togglePause}
        aria-label={paused ? 'Play background video' : 'Pause background video'}
        className="absolute right-4 top-[92px] z-10 grid size-10 place-items-center rounded-full bg-ink/45 text-cream backdrop-blur-sm transition-colors hover:bg-ink/70 sm:right-7 lg:top-[108px]"
      >
        {paused ? <Play className="size-4 translate-x-px" /> : <Pause className="size-4" />}
      </motion.button>

      {/* RPG-style dialogue box */}
      <div className="relative px-3 sm:px-6 lg:absolute lg:inset-x-0 lg:bottom-[104px] lg:px-10">
        <motion.div style={{ y: boxY }} className="mx-auto max-w-[1400px]">
          <div className="relative max-w-[640px]">
            <div
              className="font-pixel absolute -top-[26px] left-4 z-10 flex h-[28px] items-center gap-2 bg-honey px-3 text-[0.65rem] text-ink sm:text-xs"
              style={{ clipPath: 'polygon(0 4px,4px 4px,4px 0,calc(100% - 4px) 0,calc(100% - 4px) 4px,100% 4px,100% 100%,0 100%)' }}
            >
              <PixelSprite sprite={HONEY_DROP} scale={2} />
              Level 1 · New keeper
            </div>
            <div className="px-shadow">
              <div className="px-frame px-notch-2">
                <div className="px-fill px-notch-2 relative bg-paper/[0.97] p-4 pt-5 sm:p-8">
                  <div className="flex gap-5">
                    <div
                      className="px-notch hidden size-[76px] shrink-0 place-items-center bg-honey sm:grid"
                      aria-hidden="true"
                    >
                      <PixelSprite sprite={BEE_TOP} scale={5} className="animate-bob" />
                    </div>
                    <div>
                      <h1 className="text-[clamp(2rem,1.1rem+3.4vw,4.25rem)] font-semibold text-ink">
                        Beekeeping gear that earns its stripes.
                      </h1>
                      <p className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-ink-soft sm:mt-4 sm:text-lg">
                        {numberWord(PRODUCTS.length, true)} pieces of honest, field-tested equipment — from a cedar starter hive to a smart
                        hive monitor. Everything a new keeper needs, nothing they don’t.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                    <Button asChild size="lg" className="h-12 sm:h-14">
                      <Link to={`/product/${starter.slug}`}>
                        Shop the Starter Hive · {formatPrice(starter.price)}
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="paper" className="h-12 sm:h-14">
                      <Link to="/shop">
                        Browse all {PRODUCTS.length} pieces <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.78rem] font-semibold text-ink-soft sm:mt-6 sm:gap-x-5 sm:text-sm">
                    <li className="flex items-center gap-2">
                      <PixelSprite sprite={HEART} scale={2} />
                      Free US shipping over $99
                    </li>
                    <li className="flex items-center gap-2">
                      <PixelSprite sprite={HONEY_DROP} scale={2} />
                      2-year hive warranty
                    </li>
                    <li className="flex items-center gap-2">
                      <PixelSprite sprite={SPARKLE} scale={2} />
                      30-day returns
                    </li>
                  </ul>
                  <a
                    href="#after-hero"
                    aria-label="Scroll to the shop"
                    className="absolute bottom-3 right-4 hidden text-ink sm:block"
                  >
                    <span className="block animate-blink" aria-hidden="true">
                      <svg width="14" height="10" viewBox="0 0 7 5" shapeRendering="crispEdges">
                        <path d="M0 0h7v1H0zM1 1h5v1H1zM2 2h3v1H2zM3 3h1v1H3z" fill="currentColor" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <PixelMeadow className="absolute inset-x-0 bottom-0" ground="#173d1f" seed={7} density={0.6} />
    </section>
  )
}
