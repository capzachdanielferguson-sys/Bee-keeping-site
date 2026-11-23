import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { motion } from 'motion/react'

import { PageHero } from '@/components/layout/PageHero'
import { ProductCard } from '@/components/product/ProductCard'
import { StarterQuest } from '@/components/layout/CartDrawer'
import { CATEGORIES, PRODUCTS, type CategoryId } from '@/data/products'
import { useDocumentTitle } from '@/lib/hooks'
import { cn } from '@/lib/utils'

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name'

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const cat = (params.get('c') as CategoryId | null) ?? null
  const sort = (params.get('sort') as Sort | null) ?? 'featured'
  const category = CATEGORIES.find((c) => c.id === cat)
  useDocumentTitle(category ? category.label : 'Shop all gear')

  const items = useMemo(() => {
    const list = category ? PRODUCTS.filter((p) => p.category === category.id) : [...PRODUCTS]
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [category, sort])

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <>
      <PageHero
        seed={12}
        crumbs={category ? [{ label: 'Shop', to: '/shop' }, { label: category.label }] : [{ label: 'Shop' }]}
        eyebrow={`Inventory · ${items.length} ${items.length === 1 ? 'item' : 'items'}`}
        title={category ? category.label : 'All beekeeping gear'}
        description={
          category
            ? category.blurb
            : 'Ten pieces that cover your first season end to end — hive, protection, tools, harvest and a smart monitor.'
        }
      />

      <div className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 border-b-2 border-ink pb-5 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0" role="group" aria-label="Filter by category">
            {[{ id: null, label: 'All' } as { id: CategoryId | null; label: string }, ...CATEGORIES].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => set('c', c.id)}
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
          <label className="flex items-center gap-3 text-sm font-semibold text-ink-soft">
            Sort by
            <select
              value={sort}
              onChange={(e) => set('sort', e.target.value === 'featured' ? null : e.target.value)}
              className="h-10 border-2 border-ink bg-paper px-3 font-bold text-ink"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
          <motion.ul layout className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: Math.min(i, 6) * 0.03 }}
              >
                <ProductCard product={p} priority={i < 3} />
              </motion.li>
            ))}
          </motion.ul>
          <aside className="order-first lg:order-none">
            <div className="lg:sticky lg:top-28">
              <StarterQuest />
              <div className="mt-4 border-2 border-ink bg-paper p-4 text-sm text-ink-soft">
                <p className="font-pixel text-[0.65rem] text-ink">Good to know</p>
                <ul className="mt-2 space-y-1.5">
                  <li>Free US shipping over $99</li>
                  <li>Ships in 1–2 business days</li>
                  <li>30-day returns, free size exchanges</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
