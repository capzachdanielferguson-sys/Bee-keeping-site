import { Link, useNavigate } from 'react-router'
import { Plus } from 'lucide-react'

import { categoryLabel, type Product } from '@/data/products'
import { useAddToCart } from '@/lib/hooks'
import { asset, cn, formatPrice } from '@/lib/utils'

/** Four L-shaped corner brackets — the "selected item" cursor from old RPG menus. */
export function SelectCursor({ className }: { className?: string }) {
  const base =
    'absolute size-4 border-ink transition-transform duration-200 [transition-timing-function:steps(3)] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
  return (
    <span aria-hidden="true" className={cn('pointer-events-none absolute -inset-1.5 z-10', className)}>
      <span className={cn(base, 'left-0 top-0 border-l-4 border-t-4 -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-within:translate-x-0 group-focus-within:translate-y-0')} />
      <span className={cn(base, 'right-0 top-0 border-r-4 border-t-4 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-within:translate-x-0 group-focus-within:translate-y-0')} />
      <span className={cn(base, 'bottom-0 left-0 border-b-4 border-l-4 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-within:translate-x-0 group-focus-within:translate-y-0')} />
      <span className={cn(base, 'bottom-0 right-0 border-b-4 border-r-4 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 group-focus-within:translate-x-0 group-focus-within:translate-y-0')} />
    </span>
  )
}

export function ProductCard({
  product,
  className,
  priority = false,
  size = 'default',
}: {
  product: Product
  className?: string
  priority?: boolean
  size?: 'default' | 'large'
}) {
  const addToCart = useAddToCart()
  const navigate = useNavigate()
  const href = `/product/${product.slug}`

  return (
    <article className={cn('group relative flex h-full flex-col', className)}>
      <div className={cn('relative', size === 'large' && 'xl:min-h-0 xl:flex-1')}>
        <SelectCursor />
        <Link
          to={href}
          className={cn('px-notch relative block overflow-hidden bg-card focus-visible:outline-none', size === 'large' && 'xl:h-full')}
          aria-label={`${product.name}, ${formatPrice(product.price)}`}
        >
          <img
            src={asset(product.image)}
            alt={product.imageAlt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width={900}
            height={900}
            className={cn(
              'aspect-square w-full object-cover transition-transform duration-500 ease-[var(--ease-snappy)] group-hover:scale-[1.04]',
              size === 'large' && 'sm:aspect-[4/3] sm:object-contain xl:aspect-auto xl:h-full',
            )}
          />
          {product.badge && (
            <span className="font-pixel absolute left-3 top-3 bg-ink px-2 py-1 text-[0.6rem] text-cream">
              {product.badge}
            </span>
          )}
          <span className="font-pixel absolute right-3 top-3 bg-cream/85 px-1.5 py-0.5 text-[0.55rem] text-ink-soft">
            {product.sku}
          </span>
        </Link>
        <button
          type="button"
          onClick={(e) =>
            product.sizes ? navigate(href) : addToCart(product, { source: e.currentTarget })
          }
          className="btn-px absolute bottom-3 right-3 z-20 flex h-10 items-center gap-1.5 px-3 text-sm font-bold opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
          style={{ '--btn-lift': '3px' } as React.CSSProperties}
          aria-label={product.sizes ? `Choose a size for ${product.name}` : `Add ${product.name} to cart`}
        >
          <Plus className="size-4" aria-hidden="true" />
          {product.sizes ? 'Choose size' : 'Add'}
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-pixel text-[0.6rem] text-honey-deep">{categoryLabel(product.category)}</p>
          <h3 className={cn('mt-1 font-semibold leading-tight text-ink', size === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl')}>
            <Link to={href} className="hover:underline hover:decoration-honey hover:decoration-[3px] hover:underline-offset-4">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{product.tagline}</p>
        </div>
        <p className="tabular shrink-0 pt-4 text-lg font-extrabold text-ink">{formatPrice(product.price)}</p>
      </div>
    </article>
  )
}
