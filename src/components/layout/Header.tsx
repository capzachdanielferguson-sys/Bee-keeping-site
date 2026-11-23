import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { motion, useAnimationControls } from 'motion/react'
import { ShoppingBag, UserRound } from 'lucide-react'

import { ImmersiveMenu } from '@/components/ui/immersive-full-screen-nav'
import { InstagramIcon, Logo, PinterestIcon, TikTokIcon, YouTubeIcon } from '@/components/brand'
import { MAIN_NAV, MENU_LINKS, SITE } from '@/data/site'
import { useCart } from '@/store/cart'
import { useAuth } from '@/store/auth'
import { cn } from '@/lib/utils'

const SOCIALS = [
  { label: 'Instagram', href: SITE.socials.instagram, icon: <InstagramIcon className="size-6" /> },
  { label: 'TikTok', href: SITE.socials.tiktok, icon: <TikTokIcon className="size-6" /> },
  { label: 'YouTube', href: SITE.socials.youtube, icon: <YouTubeIcon className="size-6" /> },
  { label: 'Pinterest', href: SITE.socials.pinterest, icon: <PinterestIcon className="size-6" /> },
]

const MENU_IMAGES = [
  { src: 'media/beekeeper.jpg', alt: 'A beekeeper lifting a frame of honeycomb in a meadow' },
  { src: 'media/products/hive-kit.jpg', alt: 'The Meadow Starter Hive' },
  { src: 'media/products/jacket.jpg', alt: 'The Airflow Vented Jacket' },
]

export function Header() {
  const { totals, open: openCart, pulse } = useCart()
  const { user, openAuth } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const bump = useAnimationControls()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (pulse > 0) bump.start({ y: [0, -6, 0, -3, 0], transition: { duration: 0.45, ease: 'easeOut' } })
  }, [pulse, bump])

  // Close the menu on navigation.
  useEffect(() => setMenuOpen(false), [location.pathname, location.search])

  const currentFull = location.pathname + location.search

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] px-3 pt-[calc(12px+env(safe-area-inset-top,0px))] sm:px-5 sm:pt-[calc(16px+env(safe-area-inset-top,0px))]">
        <div
          className={cn(
            'pointer-events-auto mx-auto max-w-[1400px] transition-[filter] duration-300',
            scrolled ? 'px-shadow' : 'px-shadow-soft',
          )}
        >
          <div className="px-frame px-notch" style={{ '--frame': 'var(--color-ink)' } as React.CSSProperties}>
            <div className="px-fill px-notch flex h-[60px] items-center gap-2 bg-cream/95 pl-3 pr-2 backdrop-blur sm:gap-3 sm:pl-4">
              <Link to="/" aria-label="yourstripes — home" className="shrink-0">
                <Logo />
              </Link>

              <nav aria-label="Primary" className="ml-6 hidden lg:block">
                <ul className="flex items-center gap-1">
                  {MAIN_NAV.map((item) => {
                    const active = item.to === currentFull
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          aria-current={active ? 'page' : undefined}
                          className="px-underline px-3 py-2 text-[0.95rem] font-semibold text-ink-soft transition-colors hover:text-ink aria-[current=page]:text-ink"
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              <div className="ml-auto flex items-center gap-1 sm:gap-2">
                {user ? (
                  <Link
                    to="/account"
                    aria-label={`Your account, ${user.name}`}
                    className="hidden h-11 items-center gap-2 px-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink sm:flex"
                  >
                    <span
                      className="px-notch grid size-7 place-items-center bg-leaf text-xs font-extrabold text-ink"
                      style={{ '--px': '2px' } as React.CSSProperties}
                      aria-hidden="true"
                    >
                      {user.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="max-w-[9ch] truncate">Hi, {user.name.split(' ')[0]}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => openAuth('login')}
                    className="hidden h-11 items-center gap-2 px-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink sm:flex"
                    aria-label="Log in or sign up"
                  >
                    <UserRound className="size-5" aria-hidden="true" />
                    <span>Log in</span>
                  </button>
                )}

                <motion.button
                  animate={bump}
                  onClick={openCart}
                  data-cart-button
                  className="relative flex h-11 items-center gap-2 px-3 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
                  aria-label={`Open cart, ${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'}`}
                >
                  <ShoppingBag className="size-5" aria-hidden="true" />
                  <span className="hidden sm:inline">Cart</span>
                  <span
                    className={cn(
                      'font-pixel grid h-5 min-w-5 place-items-center px-1 text-[0.65rem] leading-none',
                      totals.itemCount ? 'bg-honey text-ink' : 'bg-ink/10 text-ink-soft',
                    )}
                  >
                    {totals.itemCount}
                  </span>
                </motion.button>

                <button
                  onClick={() => setMenuOpen(true)}
                  aria-expanded={menuOpen}
                  aria-controls="site-menu"
                  aria-label="Open menu"
                  className="btn-px btn-px--ink mr-0.5 flex h-11 items-center gap-3 px-3 sm:pl-4 sm:pr-3.5"
                  style={{ '--btn-lift': '3px' } as React.CSSProperties}
                >
                  <span className="font-pixel hidden text-xs sm:inline">Menu</span>
                  <span className="flex w-5 flex-col gap-[5px]" aria-hidden="true">
                    <span className="block h-[3px] w-full bg-current" />
                    <span className="block h-[3px] w-3/4 bg-current" />
                    <span className="block h-[3px] w-full bg-current" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <ImmersiveMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={MENU_LINKS}
        images={MENU_IMAGES}
        socials={SOCIALS}
        brand={<Logo tone="cream" />}
        tagline="Ten pieces of honest beekeeping gear — everything a new keeper needs, nothing they don’t."
        location={`${SITE.shipsFrom} · ${SITE.email}`}
        clipOrigin="top"
      />
    </>
  )
}
