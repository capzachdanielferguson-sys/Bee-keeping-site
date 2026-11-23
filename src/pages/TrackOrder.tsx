import { useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InfoLayout } from '@/components/layout/InfoLayout'
import { loadOrders, orderStage, type StoredOrder } from '@/store/orders'
import { useDocumentTitle } from '@/lib/hooks'
import { asset, cn, formatPrice } from '@/lib/utils'

const STAGES = [
  ['Placed', 'We’ve got your order.'],
  ['Packed', 'Boxed up and labelled.'],
  ['Shipped', 'On its way to you.'],
  ['Delivered', 'Time to suit up.'],
] as const

export default function TrackOrder() {
  useDocumentTitle('Track an order')
  const id = useId()
  const [result, setResult] = useState<StoredOrder | 'missing' | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const number = d.number.trim().toUpperCase()
    const email = d.email.trim().toLowerCase()
    const found = loadOrders().find((o) => o.number === number && o.email === email)
    setResult(found ?? 'missing')
  }

  const stage = result && result !== 'missing' ? orderStage(result) : 0

  return (
    <InfoLayout eyebrow="Help · Orders" title="Track an order" description="Enter your order number and the email you used at checkout." crumb="Track an order" seed={27}>
      <form onSubmit={onSubmit} className="grid max-w-2xl gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor={`${id}-n`}>Order number</Label>
          <Input id={`${id}-n`} name="number" placeholder="YS-123456" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-e`}>Email</Label>
          <Input id={`${id}-e`} name="email" type="email" autoComplete="email" required />
        </div>
        <Button type="submit" className="h-12">Track</Button>
      </form>

      <AnimatePresence mode="wait">
        {result === 'missing' && (
          <motion.p key="missing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="alert" className="mt-8 max-w-2xl border-l-4 border-poppy bg-poppy/10 px-4 py-3 font-semibold text-[#9c2a21]">
            We couldn’t find an order with those details. Check the number in your confirmation email, or{' '}
            <Link to="/contact" className="underline">contact us</Link>.
          </motion.p>
        )}
        {result && result !== 'missing' && (
          <motion.div key="found" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10 max-w-2xl border-2 border-ink bg-paper p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-pixel text-sm">{result.number}</p>
              <p className="tabular font-extrabold">{formatPrice(result.total)}</p>
            </div>
            <ol className="mt-6 grid gap-4 sm:grid-cols-4" aria-label={`Status: ${STAGES[stage][0]}`}>
              {STAGES.map(([label, note], i) => (
                <li key={label}>
                  <span className={cn('block h-3', i <= stage ? 'bg-leaf' : 'bg-ink/10')} />
                  <p className={cn('font-pixel mt-2 text-[0.65rem]', i <= stage ? 'text-ink' : 'text-muted')}>{label}</p>
                  <p className="text-sm text-muted">{note}</p>
                </li>
              ))}
            </ol>
            <ul className="mt-6 flex flex-wrap gap-2">
              {result.items.map((i) => (
                <li key={i.name + i.size}>
                  <img src={asset(i.image)} alt={`${i.name} × ${i.qty}`} className="size-14 bg-card object-cover" />
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </InfoLayout>
  )
}
