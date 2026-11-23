import { useCallback, useEffect } from 'react'
import { burstFromElement } from '@/components/pixel/ClickSparks'
import { useToast } from '@/components/ui/toast'
import type { Product } from '@/data/products'
import { useCart } from '@/store/cart'
import { formatPrice } from './utils'

/** Sets the document title for a page. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} · yourstripes` : 'yourstripes — Beekeeping gear that earns its stripes'
    return () => {
      document.title = prev
    }
  }, [title])
}

/** Add-to-cart with the honey burst, cart bump and a confirmation toast. */
export function useAddToCart() {
  const { add, open } = useCart()
  const { toast } = useToast()
  return useCallback(
    (product: Product, opts: { size?: string; qty?: number; source?: Element | null } = {}) => {
      add(product.id, { size: opts.size, qty: opts.qty })
      burstFromElement(opts.source ?? null, { big: true })
      toast({
        title: `Added ${product.name}`,
        description: `${opts.qty && opts.qty > 1 ? `${opts.qty} × ` : ''}${formatPrice(product.price)}${opts.size ? ` · Size ${opts.size}` : ''}`,
        image: product.image,
        action: { label: 'View cart', onClick: open },
      })
    },
    [add, open, toast],
  )
}
