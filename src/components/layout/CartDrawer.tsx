import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import { Link, useNavigate } from 'react-router'
import { Minus, Plus, Trash2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { HIVE } from '@/components/pixel/sprites'
import { XpBar } from '@/components/pixel/StatBar'
import { FREE_SHIPPING_THRESHOLD, STARTER_DISCOUNT, STARTER_IDS, getProductById } from '@/data/products'
import { useCart } from '@/store/cart'
import { asset, cn, formatPrice } from '@/lib/utils'

export function StarterQuest({ className }: { className?: string }) {
  const { lines, totals, addMany } = useCart()
  const missing = STARTER_IDS.filter((id) => !lines.some((l) => l.productId === id))
  return (
    <div className={cn('border-2 border-ink bg-honey/15 p-3', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-pixel text-[0.65rem] text-ink">
          Starter quest {totals.starterFound}/{STARTER_IDS.length}
        </p>
        <p className="text-xs font-bold text-honey-deep">
          {totals.starterComplete ? `Unlocked · ${STARTER_DISCOUNT * 100}% off` : `${STARTER_DISCOUNT * 100}% off all five`}
        </p>
      </div>
      <ul className="mt-2.5 grid grid-cols-5 gap-1.5">
        {STARTER_IDS.map((id) => {
          const p = getProductById(id)!
          const have = !missing.includes(id)
          return (
            <li
              key={id}
              title={p.name}
              className={cn(
                'relative aspect-square overflow-hidden border-2',
                have ? 'border-ink bg-card' : 'border-dashed border-ink/30 bg-paper',
              )}
            >
              <img
                src={asset(p.image)}
                alt={p.name}
                className={cn('h-full w-full object-cover', !have && 'opacity-30 grayscale')}
                loading="lazy"
              />
              {have && <span className="absolute right-0 top-0 size-2.5 bg-leaf" aria-hidden="true" />}
            </li>
          )
        })}
      </ul>
      {!totals.starterComplete && (
        <button
          type="button"
          onClick={() => addMany(missing)}
          className="mt-2.5 w-full text-left text-xs font-bold text-ink underline decoration-2 underline-offset-4 hover:decoration-honey"
        >
          Add the {missing.length === STARTER_IDS.length ? 'full kit' : `missing ${missing.length}`} → save{' '}
          {formatPrice(
            Math.round(STARTER_IDS.reduce((s, id) => s + (getProductById(id)?.price ?? 0), 0) * STARTER_DISCOUNT),
          )}
        </button>
      )}
    </div>
  )
}

export function CartDrawer() {
  const { lines, totals, isOpen, close, setQty, remove } = useCart()
  const navigate = useNavigate()

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(o) => (o ? undefined : close())}>
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[100] bg-ink/55 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
              <motion.aside
                className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-[440px] flex-col border-l-4 border-ink bg-cream shadow-[-8px_0_0_rgb(23_32_15/0.15)] focus:outline-none"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between border-b-2 border-ink/10 px-5 py-4">
                  <DialogPrimitive.Title className="font-display text-2xl font-semibold">
                    Your cart{' '}
                    <span className="font-pixel ml-1 align-middle text-xs text-muted">
                      · {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close className="grid size-10 place-items-center hover:bg-ink/5" aria-label="Close cart">
                    <X className="size-5" />
                  </DialogPrimitive.Close>
                </div>

                {lines.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                    <PixelSprite sprite={HIVE} scale={6} className="animate-bob" />
                    <p className="mt-6 font-display text-2xl font-semibold">Your hive is empty.</p>
                    <p className="mt-2 text-ink-soft">Every colony starts somewhere — most start with a hive.</p>
                    <Button
                      className="mt-6"
                      onClick={() => {
                        close()
                        navigate('/product/meadow-starter-hive')
                      }}
                    >
                      See the Starter Hive
                    </Button>
                    <StarterQuest className="mt-8 w-full text-left" />
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                      <div className="mb-4">
                        <p className="mb-2 text-sm font-semibold text-ink-soft" aria-live="polite">
                          {totals.freeShippingRemaining > 0 ? (
                            <>
                              You’re <strong className="text-ink">{formatPrice(totals.freeShippingRemaining)}</strong> away
                              from free shipping.
                            </>
                          ) : (
                            <span className="text-meadow-deep">Free shipping unlocked.</span>
                          )}
                        </p>
                        <XpBar value={FREE_SHIPPING_THRESHOLD - totals.freeShippingRemaining} max={FREE_SHIPPING_THRESHOLD} />
                      </div>

                      <StarterQuest className="mb-5" />

                      <ul className="divide-y-2 divide-dashed divide-ink/10">
                        <AnimatePresence initial={false}>
                          {lines.map((line) => (
                            <motion.li
                              key={line.key}
                              layout
                              initial={{ opacity: 0, x: 24 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 24, height: 0 }}
                              className="flex gap-4 py-4"
                            >
                              <Link
                                to={`/product/${line.product.slug}`}
                                onClick={close}
                                className="px-notch size-20 shrink-0 overflow-hidden bg-card"
                              >
                                <img src={asset(line.product.image)} alt={line.product.imageAlt} className="h-full w-full object-cover" />
                              </Link>
                              <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <Link
                                      to={`/product/${line.product.slug}`}
                                      onClick={close}
                                      className="font-bold leading-tight hover:underline"
                                    >
                                      {line.product.name}
                                    </Link>
                                    {line.size && <p className="text-sm text-muted">Size {line.size}</p>}
                                  </div>
                                  <p className="tabular font-bold">{formatPrice(line.product.price * line.qty)}</p>
                                </div>
                                <div className="mt-auto flex items-center justify-between pt-2">
                                  <div className="flex items-center border-2 border-ink">
                                    <button
                                      type="button"
                                      onClick={() => setQty(line.key, line.qty - 1)}
                                      className="grid size-8 place-items-center hover:bg-ink/5"
                                      aria-label={`Decrease quantity of ${line.product.name}`}
                                    >
                                      <Minus className="size-3.5" />
                                    </button>
                                    <span className="tabular w-8 text-center text-sm font-bold" aria-live="polite">
                                      {line.qty}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setQty(line.key, line.qty + 1)}
                                      className="grid size-8 place-items-center hover:bg-ink/5"
                                      aria-label={`Increase quantity of ${line.product.name}`}
                                    >
                                      <Plus className="size-3.5" />
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => remove(line.key)}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-poppy"
                                  >
                                    <Trash2 className="size-4" aria-hidden="true" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    </div>

                    <div className="border-t-4 border-ink bg-paper px-5 pb-5 pt-4">
                      <dl className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-ink-soft">Subtotal</dt>
                          <dd className="tabular font-semibold">{formatPrice(totals.subtotal)}</dd>
                        </div>
                        {totals.discount > 0 && (
                          <div className="flex justify-between text-meadow-deep">
                            <dt>Starter Quest bonus</dt>
                            <dd className="tabular font-semibold">−{formatPrice(totals.discount)}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-ink-soft">Shipping</dt>
                          <dd className="tabular font-semibold">{totals.shipping ? formatPrice(totals.shipping) : 'Free'}</dd>
                        </div>
                        <div className="flex justify-between border-t-2 border-dashed border-ink/15 pt-2 text-base">
                          <dt className="font-bold">Total</dt>
                          <dd className="tabular font-extrabold">{formatPrice(totals.total)}</dd>
                        </div>
                      </dl>
                      <Button
                        size="lg"
                        className="mt-4 w-full"
                        onClick={() => {
                          close()
                          navigate('/checkout')
                        }}
                      >
                        Checkout · {formatPrice(totals.total)}
                      </Button>
                      <p className="mt-2.5 text-center text-xs text-muted">Taxes calculated at checkout · 30-day returns</p>
                    </div>
                  </>
                )}
              </motion.aside>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}
