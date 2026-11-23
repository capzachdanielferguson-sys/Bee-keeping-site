import { useId, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PixelScene } from '@/components/pixel/PixelScenery'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { BEE_TOP, HIVE } from '@/components/pixel/sprites'
import { burstFromElement } from '@/components/pixel/ClickSparks'
import { StarterQuest } from '@/components/layout/CartDrawer'
import { FREE_SHIPPING_THRESHOLD } from '@/data/products'
import { useAuth } from '@/store/auth'
import { useCart } from '@/store/cart'
import { useDocumentTitle } from '@/lib/hooks'
import { asset, cn, formatPrice } from '@/lib/utils'
import { saveOrder, type StoredOrder } from '@/store/orders'


const US_STATES = 'AL AZ AR CA CO CT DE DC FL GA ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' ')

function Field({
  label,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = useId()
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-e` : undefined} {...props} />
      {error && (
        <p id={`${id}-e`} className="text-sm font-semibold text-poppy">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Checkout() {
  useDocumentTitle('Checkout')
  const { lines, totals, clear } = useCart()
  const { user, openAuth } = useAuth()
  const [method, setMethod] = useState<'standard' | 'express'>('standard')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState<StoredOrder | null>(null)
  const submitRef = useRef<HTMLButtonElement | null>(null)

  const shipping = method === 'express' ? 19 : totals.shipping
  const total = totals.subtotal - totals.discount + shipping

  if (order) {
    return (
      <PixelScene className="min-h-[86svh]" seed={17} bees={5}>
        <div className="mx-auto flex max-w-[1400px] justify-center px-4 pb-40 pt-32">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl px-shadow">
            <div className="px-frame px-notch-2">
              <div className="px-fill px-notch-2 bg-paper p-8 text-center sm:p-10">
                <div className="mx-auto grid size-24 place-items-center bg-honey px-notch">
                  <PixelSprite sprite={BEE_TOP} scale={6} className="animate-bob" />
                </div>
                <p className="font-pixel mt-6 text-xs text-honey-deep">Quest complete</p>
                <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Thanks, {order.name.split(' ')[0]}!</h1>
                <p className="mt-3 text-ink-soft">
                  Order <strong className="font-pixel text-sm text-ink">{order.number}</strong> is in. A confirmation is
                  headed to {order.email}, and we’ll email tracking as soon as it ships.
                </p>
                <ul className="mt-6 space-y-2 text-left">
                  {order.items.map((i) => (
                    <li key={i.name + i.size} className="flex items-center gap-3 border-b-2 border-dashed border-ink/10 pb-2">
                      <img src={asset(i.image)} alt="" className="size-12 bg-card object-cover" />
                      <span className="flex-1 font-semibold">
                        {i.name}
                        {i.size ? ` · ${i.size}` : ''} <span className="text-muted">× {i.qty}</span>
                      </span>
                      <span className="tabular font-bold">{formatPrice(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <p className="tabular mt-4 text-right text-lg font-extrabold">Total {formatPrice(order.total)}</p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild>
                    <Link to="/track-order">Track this order</Link>
                  </Button>
                  <Button asChild variant="paper">
                    <Link to="/shop">Keep shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </PixelScene>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 pb-10 pt-40 text-center">
        <PixelSprite sprite={HIVE} scale={7} className="animate-bob" />
        <h1 className="mt-8 text-4xl font-semibold">Your cart is empty.</h1>
        <p className="mt-3 text-ink-soft">Add a few pieces and come back — checkout takes about a minute.</p>
        <Button asChild className="mt-8">
          <Link to="/shop">Browse the shop</Link>
        </Button>
      </div>
    )
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const errs: Record<string, string> = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email?.trim() ?? '')) errs.email = 'Enter a valid email.'
    if (!data.name?.trim()) errs.name = 'Required.'
    if (!data.address?.trim()) errs.address = 'Required.'
    if (!data.city?.trim()) errs.city = 'Required.'
    if (!data.state) errs.state = 'Required.'
    if (!/^\d{5}(-\d{4})?$/.test(data.zip?.trim() ?? '')) errs.zip = 'Use a 5-digit ZIP.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 900))
    const placed: StoredOrder = {
      number: `YS-${Math.floor(100000 + Math.random() * 900000)}`,
      email: data.email.trim().toLowerCase(),
      name: data.name.trim(),
      placed: new Date().toISOString(),
      total,
      shippingMethod: method,
      items: lines.map((l) => ({ name: l.product.name, qty: l.qty, size: l.size, price: l.product.price, image: l.product.image })),
    }
    saveOrder(placed)
    burstFromElement(submitRef.current, { big: true })
    clear()
    setPlacing(false)
    setOrder(placed)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-[100px] sm:px-6 sm:pt-[120px] lg:px-10">
      <p className="font-pixel text-xs text-honey-deep">Checkout</p>
      <h1 className="mt-2 text-[clamp(2.25rem,1.5rem+2.4vw,3.4rem)] font-semibold">Almost there.</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={onSubmit} noValidate className="space-y-10">
          <section aria-labelledby="co-contact">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="co-contact" className="font-sans text-xl font-bold tracking-normal">
                1 · Contact
              </h2>
              {!user && (
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="text-sm font-semibold underline decoration-2 underline-offset-4 hover:decoration-honey"
                >
                  Have an account? Log in
                </button>
              )}
            </div>
            <div className="mt-4 grid gap-4">
              <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={user?.email} error={errors.email} />
            </div>
          </section>

          <section aria-labelledby="co-ship">
            <h2 id="co-ship" className="font-sans text-xl font-bold tracking-normal">
              2 · Shipping address
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-6">
              <Field className="sm:col-span-6" label="Full name" name="name" autoComplete="name" defaultValue={user?.name} error={errors.name} />
              <Field className="sm:col-span-6" label="Street address" name="address" autoComplete="street-address" error={errors.address} />
              <Field className="sm:col-span-6" label="Apartment, suite (optional)" name="address2" autoComplete="address-line2" />
              <Field className="sm:col-span-3" label="City" name="city" autoComplete="address-level2" error={errors.city} />
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="co-state">State</Label>
                <select
                  id="co-state"
                  name="state"
                  autoComplete="address-level1"
                  aria-invalid={Boolean(errors.state)}
                  className="h-12 w-full border-2 border-ink bg-paper px-2 font-semibold aria-[invalid=true]:border-poppy"
                  defaultValue=""
                >
                  <option value="" disabled>
                    —
                  </option>
                  {US_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <Field className="sm:col-span-2" label="ZIP" name="zip" autoComplete="postal-code" inputMode="numeric" error={errors.zip} />
            </div>
          </section>

          <section aria-labelledby="co-method">
            <h2 id="co-method" className="font-sans text-xl font-bold tracking-normal">
              3 · Delivery
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="co-method">
              {(
                [
                  ['standard', 'Standard', '3–6 business days', totals.shipping ? formatPrice(totals.shipping) : 'Free'],
                  ['express', 'Express', '1–3 business days', formatPrice(19)],
                ] as const
              ).map(([id, label, eta, price]) => (
                <label
                  key={id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 border-2 p-4 transition-colors',
                    method === id ? 'border-ink bg-honey/20' : 'border-ink/25 bg-paper hover:border-ink',
                  )}
                >
                  <input
                    type="radio"
                    name="method"
                    value={id}
                    checked={method === id}
                    onChange={() => setMethod(id)}
                    className="size-4 accent-[var(--color-ink)]"
                  />
                  <span className="flex-1">
                    <span className="block font-bold">{label}</span>
                    <span className="block text-sm text-muted">{eta}</span>
                  </span>
                  <span className="tabular font-bold">{price}</span>
                </label>
              ))}
            </div>
            {totals.shipping > 0 && method === 'standard' && (
              <p className="mt-2 text-sm text-muted">
                Add {formatPrice(totals.freeShippingRemaining)} more for free standard shipping (orders over{' '}
                {formatPrice(FREE_SHIPPING_THRESHOLD)}).
              </p>
            )}
          </section>

          <section aria-labelledby="co-pay">
            <h2 id="co-pay" className="font-sans text-xl font-bold tracking-normal">
              4 · Payment
            </h2>
            <div className="mt-4 border-2 border-dashed border-ink/40 bg-paper p-5">
              <p className="flex items-center gap-2 font-bold">
                <Lock className="size-4" aria-hidden="true" /> Secure payment
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                This storefront is a preview: card payment is handled by the payment provider you connect (Stripe or
                Shopify Payments — see the README). No payment details are collected here, and placing this order
                won’t charge anything.
              </p>
            </div>
          </section>

          <Button ref={submitRef} type="submit" size="lg" className="w-full sm:w-auto" disabled={placing}>
            {placing ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
          </Button>
        </form>

        <aside aria-labelledby="co-summary" className="lg:sticky lg:top-28 lg:self-start">
          <div className="px-shadow-soft">
            <div className="px-frame px-notch">
              <div className="px-fill px-notch bg-paper p-5 sm:p-6">
                <h2 id="co-summary" className="font-sans text-lg font-bold tracking-normal">
                  Order summary
                </h2>
                <ul className="mt-4 space-y-3">
                  {lines.map((l) => (
                    <li key={l.key} className="flex items-center gap-3">
                      <span className="relative">
                        <img src={asset(l.product.image)} alt="" className="size-14 bg-card object-cover" />
                        <span className="font-pixel absolute -right-2 -top-2 grid size-5 place-items-center bg-ink text-[0.55rem] text-cream">
                          {l.qty}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{l.product.name}</span>
                        {l.size && <span className="block text-sm text-muted">Size {l.size}</span>}
                      </span>
                      <span className="tabular font-bold">{formatPrice(l.product.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-5 space-y-1.5 border-t-2 border-dashed border-ink/15 pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Subtotal</dt>
                    <dd className="tabular font-semibold">{formatPrice(totals.subtotal)}</dd>
                  </div>
                  <AnimatePresence>
                    {totals.discount > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between text-meadow-deep">
                        <dt>Starter Quest bonus</dt>
                        <dd className="tabular font-semibold">−{formatPrice(totals.discount)}</dd>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Shipping</dt>
                    <dd className="tabular font-semibold">{shipping ? formatPrice(shipping) : 'Free'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Estimated tax</dt>
                    <dd className="text-muted">Calculated by provider</dd>
                  </div>
                  <div className="flex justify-between border-t-2 border-ink pt-2 text-lg">
                    <dt className="font-bold">Total</dt>
                    <dd className="tabular font-extrabold">{formatPrice(total)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <StarterQuest className="mt-4" />
        </aside>
      </div>
    </div>
  )
}
