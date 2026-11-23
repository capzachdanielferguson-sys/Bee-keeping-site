import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

import AuthDialog from '@/components/ui/auth-dialog'
import { ClickSparks } from '@/components/pixel/ClickSparks'
import { PixelDissolve } from '@/components/pixel/PixelDissolve'
import { CartDrawer } from './CartDrawer'
import { CookieBanner } from './CookieBanner'
import { Footer } from './Footer'
import { Header } from './Header'

/** Scroll to top (or to #hash) on navigation. */
function ScrollManager() {
  const { pathname, hash, search } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView({ block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash, search])
  return null
}

export function Layout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <AuthDialog />
      <CookieBanner />
      <ClickSparks />
      <PixelDissolve />
    </>
  )
}
