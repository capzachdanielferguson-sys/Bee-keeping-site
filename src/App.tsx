import { Suspense, lazy } from 'react'
import { RouterProvider, createBrowserRouter, createHashRouter, createMemoryRouter, useParams, type RouteObject } from 'react-router'

import { Layout } from '@/components/layout/Layout'
import { ToastProvider } from '@/components/ui/toast'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { BEE_TOP } from '@/components/pixel/sprites'
import { AuthProvider } from '@/store/auth'
import { CartProvider } from '@/store/cart'
import Home from '@/pages/Home'

// Everything except the home page is split into its own chunk.
const Shop = lazy(() => import('@/pages/Shop'))
const ProductPage = lazy(() => import('@/pages/Product'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const AuthPage = lazy(() => import('@/pages/AuthPage'))
const Account = lazy(() => import('@/pages/Account'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Faq = lazy(() => import('@/pages/Faq'))
const Policy = lazy(() => import('@/pages/Policy'))
const TrackOrder = lazy(() => import('@/pages/TrackOrder'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function PageLoader() {
  return (
    <div className="grid min-h-[70svh] place-items-center" role="status" aria-label="Loading">
      <PixelSprite sprite={BEE_TOP} scale={5} className="animate-bob" />
    </div>
  )
}

const page = (el: React.ReactNode) => <Suspense fallback={<PageLoader />}>{el}</Suspense>

/** Remount the product page per slug so its local state (size, qty) resets. */
function ProductRoute() {
  const { slug } = useParams()
  return <ProductPage key={slug} />
}

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: page(<Shop />) },
      { path: '/product/:slug', element: page(<ProductRoute />) },
      { path: '/checkout', element: page(<Checkout />) },
      { path: '/login', element: page(<AuthPage key="login" mode="login" />) },
      { path: '/signup', element: page(<AuthPage key="signup" mode="signup" />) },
      { path: '/account', element: page(<Account />) },
      { path: '/about', element: page(<About />) },
      { path: '/contact', element: page(<Contact />) },
      { path: '/faq', element: page(<Faq />) },
      { path: '/track-order', element: page(<TrackOrder />) },
      { path: '/shipping', element: page(<Policy id="shipping" />) },
      { path: '/returns', element: page(<Policy id="returns" />) },
      { path: '/warranty', element: page(<Policy id="warranty" />) },
      { path: '/privacy', element: page(<Policy id="privacy" />) },
      { path: '/terms', element: page(<Policy id="terms" />) },
      { path: '/cookies', element: page(<Policy id="cookies" />) },
      { path: '/accessibility', element: page(<Policy id="accessibility" />) },
      { path: '*', element: page(<NotFound />) },
    ],
  },
]

// `npm run build:static` sets VITE_ROUTER=hash for hosts without SPA rewrites;
// VITE_ROUTER=memory is for sandboxed embeds (previews) that can't own the URL.
const mode = import.meta.env.VITE_ROUTER
const router =
  mode === 'hash' ? createHashRouter(routes) : mode === 'memory' ? createMemoryRouter(routes) : createBrowserRouter(routes)

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  )
}
