import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  FLAT_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  STARTER_DISCOUNT,
  STARTER_IDS,
  getProductById,
  type Product,
} from '@/data/products'
import { readStorage, writeStorage } from '@/lib/utils'

export interface CartLine {
  key: string
  productId: string
  size?: string
  qty: number
}

export interface CartTotals {
  subtotal: number
  discount: number
  shipping: number
  total: number
  itemCount: number
  /** How many of the 5 Starter Quest items are in the cart. */
  starterFound: number
  starterComplete: boolean
  freeShippingRemaining: number
}

interface CartContextValue {
  lines: (CartLine & { product: Product })[]
  totals: CartTotals
  isOpen: boolean
  open: () => void
  close: () => void
  add: (productId: string, opts?: { size?: string; qty?: number }) => void
  addMany: (productIds: string[]) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
  /** Increments on every add — used to bump the cart icon. */
  pulse: number
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'ys_cart_v1'

const lineKey = (productId: string, size?: string) => (size ? `${productId}:${size}` : productId)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readStorage<CartLine[]>(STORAGE_KEY, []))
  const [isOpen, setOpen] = useState(false)
  const [pulse, setPulse] = useState(0)

  useEffect(() => writeStorage(STORAGE_KEY, lines), [lines])

  const add = useCallback((productId: string, opts: { size?: string; qty?: number } = {}) => {
    const qty = opts.qty ?? 1
    setLines((prev) => {
      const key = lineKey(productId, opts.size)
      const existing = prev.find((l) => l.key === key)
      if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + qty) } : l))
      return [...prev, { key, productId, size: opts.size, qty }]
    })
    setPulse((p) => p + 1)
  }, [])

  const addMany = useCallback((productIds: string[]) => {
    setLines((prev) => {
      let next = [...prev]
      for (const id of productIds) {
        const product = getProductById(id)
        // Default sized items to M so the bundle can be added in one click.
        const size = product?.sizes ? (product.sizes.includes('M') ? 'M' : product.sizes[0]) : undefined
        const already = next.some((l) => l.productId === id)
        if (already) continue
        next = [...next, { key: lineKey(id, size), productId: id, size, qty: 1 }]
      }
      return next
    })
    setPulse((p) => p + 1)
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(99, qty) } : l)),
    )
  }, [])

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), [])
  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const resolved = lines
      .map((l) => ({ ...l, product: getProductById(l.productId) }))
      .filter((l): l is CartLine & { product: Product } => Boolean(l.product))

    const subtotal = resolved.reduce((sum, l) => sum + l.product.price * l.qty, 0)
    const starterFound = STARTER_IDS.filter((id) => resolved.some((l) => l.productId === id)).length
    const starterComplete = starterFound === STARTER_IDS.length
    // Discount applies to one of each starter item.
    const starterValue = starterComplete
      ? STARTER_IDS.reduce((sum, id) => sum + (getProductById(id)?.price ?? 0), 0)
      : 0
    const discount = Math.round(starterValue * STARTER_DISCOUNT * 100) / 100
    const afterDiscount = subtotal - discount
    const shipping = subtotal === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING
    return {
      lines: resolved,
      totals: {
        subtotal,
        discount,
        shipping,
        total: Math.max(0, afterDiscount + shipping),
        itemCount: resolved.reduce((n, l) => n + l.qty, 0),
        starterFound,
        starterComplete,
        freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount),
      },
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      addMany,
      setQty,
      remove,
      clear,
      pulse,
    }
  }, [lines, isOpen, add, addMany, setQty, remove, clear, pulse])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
