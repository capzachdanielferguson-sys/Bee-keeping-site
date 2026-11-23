import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { PixelScene } from '@/components/pixel/PixelScenery'
import { useDocumentTitle } from '@/lib/hooks'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <PixelScene className="min-h-[92svh]" seed={404} bees={6}>
      <div className="mx-auto flex max-w-[1400px] justify-center px-4 pb-44 pt-36">
        <div className="w-full max-w-xl px-shadow">
          <div className="px-frame px-notch-2">
            <div className="px-fill px-notch-2 bg-paper p-8 text-center sm:p-10">
              <p className="font-pixel text-xs text-honey-deep">Error 404 · Flower not found</p>
              <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">This bloom’s already been visited.</h1>
              <p className="mt-3 text-ink-soft">The page you’re looking for has moved or never existed. Let’s fly you somewhere useful.</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild>
                  <Link to="/">Back to the meadow</Link>
                </Button>
                <Button asChild variant="paper">
                  <Link to="/shop">Browse the shop</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PixelScene>
  )
}
