'use client'

/**
 * Immersive Full Screen Navigation — adapted from 21st.dev
 * "Immersive Full Screen Navigation" by hyperiux
 * (https://21st.dev/@hyperiux/components/immersive-full-screen-nav,
 * built with Hyperiux Vault).
 *
 * Kept from the original: the GSAP clip-path wipe (open from one edge,
 * close out the other), staggered brand / link / image / social reveals,
 * the character-split link hover, the focus trap with Escape-to-close and
 * focus restore, scroll lock, an animation lock against double toggles,
 * and the reduced-motion fallback (wipe → fade, staggers → instant).
 *
 * Changed for yourstripes: controlled `open` prop so the site header owns
 * the toggle; react-router links; meadow palette; pixel grass + flying
 * pixel bees inside the panel; numbered links with a pixel-font index.
 */

import gsap from 'gsap'
import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react'
import { Link } from 'react-router'
import { PixelBees, PixelMeadow } from '@/components/pixel/PixelScenery'
import { asset } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * Focus trap (inlined from the original) — keeps keyboard focus inside a
 * container while it's open, restores it to the trigger on close.
 * ------------------------------------------------------------------ */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const isVisible = (element?: HTMLElement | null): boolean => {
  if (!element || element.hidden) return false
  const style = window.getComputedStyle(element)
  if (style.visibility === 'hidden' || style.visibility === 'collapse') return false
  return element.getClientRects().length > 0
}

const getFocusableElements = (container?: HTMLElement | null): HTMLElement[] => {
  if (!container) return []
  return (Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)) as HTMLElement[]).filter(isVisible)
}

function useFocusTrap({
  active,
  containerRef,
  initialFocusRef,
  onEscape,
}: {
  active: boolean
  containerRef: RefObject<HTMLElement | null>
  initialFocusRef?: RefObject<HTMLElement | null>
  onEscape?: () => void
}) {
  const onEscapeRef = useRef(onEscape)
  onEscapeRef.current = onEscape

  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const focusInitial = () => {
      const target = initialFocusRef?.current ?? getFocusableElements(container)[0] ?? container
      if (!(target instanceof HTMLElement)) return
      if (target === container && !container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }
    const focusFrame = requestAnimationFrame(focusInitial)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onEscapeRef.current?.()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = getFocusableElements(container)
      if (!focusable.length) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const activeElement = document.activeElement
      if (event.shiftKey) {
        if (activeElement === first || !container.contains(activeElement)) {
          event.preventDefault()
          last.focus()
        }
        return
      }
      if (activeElement === last || !container.contains(activeElement)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus({ preventScroll: true })
    }
  }, [active, containerRef, initialFocusRef])
}

/* ------------------------------------------------------------------ */

const CLIPS = {
  bottom: {
    closedInitial: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
    open: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    closedFinal: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
  },
  top: {
    closedInitial: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    open: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    closedFinal: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
  },
  left: {
    closedInitial: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    open: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    closedFinal: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
  },
  right: {
    closedInitial: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
    open: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    closedFinal: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
  },
}

const REDUCED_MOTION_FADE_DURATION = 0.2
const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true

/* Character-split hover reveal for the main links (from the original's
   NavLinkHover): each character sits above a text-shadow duplicate 1.2em
   below; on hover/focus the characters slide up with a stagger, revealing
   the duplicate. Plain text under reduced motion. */
function NavLinkHover({
  label,
  to,
  charStagger,
  reduced,
  onClick,
}: {
  label: string
  to: string
  charStagger: number
  reduced: boolean
  onClick?: () => void
}) {
  if (reduced) {
    return (
      <Link to={to} onClick={onClick} className="hover:text-honey focus-visible:text-honey">
        {label}
      </Link>
    )
  }
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group/link-hover inline-block no-underline transition-colors duration-300 hover:text-honey focus-visible:text-honey"
    >
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="relative inline-block overflow-hidden align-middle leading-[1.08]">
        {[...label].map((char, index) => (
          <span
            key={index}
            className="relative inline-block whitespace-pre transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover/link-hover:-translate-y-[1.2em] group-focus-visible/link-hover:-translate-y-[1.2em]"
            style={{ textShadow: '0 1.2em currentColor', transitionDelay: `${index * charStagger}s` }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </span>
    </Link>
  )
}

export interface MenuLink {
  label: string
  to: string
  note?: string
}

export interface MenuSocial {
  label: string
  href: string
  icon: ReactNode
}

export interface ImmersiveMenuProps {
  open: boolean
  onClose: () => void
  /** Called once the close animation has finished. */
  onClosed?: () => void
  links: MenuLink[]
  images?: { src: string; alt: string }[]
  socials?: MenuSocial[]
  brand?: ReactNode
  tagline?: string
  location?: string
  clipOrigin?: keyof typeof CLIPS
  overlayBg?: string
  openDuration?: number
  closeDuration?: number
  ease?: string
  linkStagger?: number
  linkCharStagger?: number
}

export function ImmersiveMenu({
  open,
  onClose,
  onClosed,
  links,
  images = [],
  socials = [],
  brand,
  tagline,
  location,
  clipOrigin = 'top',
  overlayBg = '#173d1f',
  openDuration = 0.9,
  closeDuration = 0.8,
  ease = 'power4.inOut',
  linkStagger = 0.06,
  linkCharStagger = 0.015,
}: ImmersiveMenuProps) {
  const overlayRef = useRef<HTMLElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const linksRef = useRef<(HTMLLIElement | null)[]>([])
  const imagesRef = useRef<(HTMLDivElement | null)[]>([])
  const socialsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const metaRef = useRef<(HTMLElement | null)[]>([])
  const timelineRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null)
  const wasOpen = useRef(false)

  const { closedInitial, open: openClip, closedFinal } = CLIPS[clipOrigin] ?? CLIPS.top
  const reduced = reduceMotion()

  // Initial closed state, before first paint. When closed the panel is also
  // visibility:hidden — a zero-area clip-path alone can let GPU-promoted
  // children (sprites, GSAP-transformed links) leak through in Chromium.
  useLayoutEffect(() => {
    gsap.set(overlayRef.current, { clipPath: closedInitial, autoAlpha: 0 })
  }, [closedInitial])

  // Panel wipe.
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    if (open === wasOpen.current) return
    wasOpen.current = open
    timelineRef.current?.kill()

    if (open) {
      gsap.set(overlay, { clipPath: closedInitial })
      gsap.set(wrapperRef.current, { opacity: 1, scale: 1 })
      if (reduced) {
        gsap.set(overlay, { clipPath: openClip, autoAlpha: 0 })
        timelineRef.current = gsap.to(overlay, { autoAlpha: 1, duration: REDUCED_MOTION_FADE_DURATION, ease: 'power2.out' })
        return
      }
      gsap.set(overlay, { autoAlpha: 1 })
      timelineRef.current = gsap.to(overlay, { clipPath: openClip, duration: openDuration, ease })
      return
    }

    if (reduced) {
      timelineRef.current = gsap.to(overlay, {
        autoAlpha: 0,
        duration: REDUCED_MOTION_FADE_DURATION,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(overlay, { clipPath: closedInitial, autoAlpha: 0 })
          onClosed?.()
        },
      })
      return
    }
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { clipPath: closedInitial, autoAlpha: 0 })
        onClosed?.()
      },
    })
    timelineRef.current = tl
    tl.to(wrapperRef.current, { scale: 0.94, opacity: 0.5, duration: 0.6, ease: 'power2.in' }).to(
      overlay,
      { clipPath: closedFinal, duration: closeDuration, ease },
      '<',
    )
  }, [open, closedInitial, openClip, closedFinal, openDuration, closeDuration, ease, reduced, onClosed])

  // Staggered content reveal.
  useEffect(() => {
    const all = [...linksRef.current, ...imagesRef.current, ...socialsRef.current, ...metaRef.current]
    gsap.killTweensOf(all)
    if (!open) return
    if (reduced) {
      gsap.set(all, { y: 0, scale: 1, opacity: 1 })
      return
    }
    const delay = Math.max(openDuration - 0.35, 0)
    gsap.fromTo(metaRef.current, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay, stagger: 0.08 })
    gsap.fromTo(
      linksRef.current,
      { y: 36, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: linkStagger, delay },
    )
    gsap.fromTo(
      imagesRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: delay + 0.1 },
    )
    gsap.fromTo(
      socialsRef.current,
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.06, delay: delay + 0.2 },
    )
  }, [open, reduced, openDuration, linkStagger])

  // Scroll lock.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useFocusTrap({ active: open, containerRef: overlayRef, initialFocusRef: closeRef, onEscape: onClose })

  return (
    <nav
      ref={overlayRef}
      id="site-menu"
      aria-label="Main menu"
      aria-hidden={!open}
      inert={!open}
      style={{ clipPath: closedInitial, backgroundColor: overlayBg, visibility: 'hidden' }}
      className={`fixed inset-0 z-[80] overflow-y-auto text-cream ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <PixelBees count={3} seed={5} scale={3} className="opacity-90" />

      <div ref={wrapperRef} className="relative z-10 flex min-h-full flex-col">
        {/* Panel header mirrors the site header so the toggle never moves. */}
        <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between px-4 sm:px-8">
          <Link to="/" onClick={onClose} className="text-cream" aria-label="yourstripes home">
            {brand}
          </Link>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close menu"
            className="group flex h-11 items-center gap-3 px-2 text-cream"
          >
            <span className="font-pixel text-xs">Close</span>
            <span className="relative block size-6" aria-hidden="true">
              <span className="absolute left-0 top-1/2 block h-[3px] w-full -translate-y-1/2 rotate-45 bg-current transition-colors group-hover:bg-honey" />
              <span className="absolute left-0 top-1/2 block h-[3px] w-full -translate-y-1/2 -rotate-45 bg-current transition-colors group-hover:bg-honey" />
            </span>
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-between gap-10 px-4 pb-6 pt-6 sm:px-8 lg:pt-10">
          <div className="flex flex-col gap-1">
            <p ref={(el) => {
                    metaRef.current[0] = el
                  }} className="font-pixel text-xs text-honey">
              Main menu
            </p>
            {tagline && (
              <p ref={(el) => {
                    metaRef.current[1] = el
                  }} className="max-w-md text-sm text-cream/70">
                {tagline}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <ul className="flex flex-col">
              {links.map((link, index) => (
                <li
                  key={link.label}
                  ref={(el) => {
                    linksRef.current[index] = el
                  }}
                  className="flex items-baseline gap-4 font-display text-[9.5vw] font-medium leading-[1.06] sm:text-[6.5vw] lg:text-[clamp(2.5rem,3.9vw,4rem)]"
                  style={{ opacity: 0 }}
                >
                  <span className="font-pixel w-8 shrink-0 text-[0.7rem] text-honey/80 sm:text-xs">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <NavLinkHover label={link.label} to={link.to} charStagger={linkCharStagger} reduced={reduced} onClick={onClose} />
                  {link.note && (
                    <span className="font-pixel hidden self-center bg-honey px-1.5 py-0.5 text-[0.6rem] text-ink sm:inline-block">
                      {link.note}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {images.length > 0 && (
              <div className="hidden items-end gap-5 md:flex">
                {images.slice(0, 3).map((img, index) => (
                  <div
                    key={img.src}
                    ref={(el) => {
                    imagesRef.current[index] = el
                  }}
                    style={{ opacity: 0 }}
                    className="px-notch relative h-[22vw] max-h-[300px] w-[16vw] max-w-[220px] overflow-hidden bg-card odd:h-[18vw]"
                  >
                    <img
                      src={asset(img.src)}
                      alt={img.alt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105 motion-reduce:transition-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              {socials.map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  ref={(el) => {
                    socialsRef.current[index] = el
                  }}
                  aria-label={social.label}
                  style={{ opacity: 0 }}
                  className="text-cream/90 transition-colors hover:text-honey"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            {location && (
              <span ref={(el) => {
                    metaRef.current[2] = el
                  }} className="text-sm text-cream/60">
                {location}
              </span>
            )}
          </div>
        </div>
        <PixelMeadow className="pointer-events-none shrink-0" ground="#0f2614" seed={21} heightPx={96} />
      </div>
    </nav>
  )
}
