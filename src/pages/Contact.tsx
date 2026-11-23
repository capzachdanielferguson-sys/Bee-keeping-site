import { useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Clock, Mail, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InfoLayout } from '@/components/layout/InfoLayout'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { BEE_SIDE_A } from '@/components/pixel/sprites'
import { SITE } from '@/data/site'
import { useAuth } from '@/store/auth'
import { useDocumentTitle } from '@/lib/hooks'

const TOPICS = ['Help choosing gear', 'An existing order', 'Returns or exchanges', 'Warranty claim', 'HiveSense support', 'Wholesale or press', 'Something else']

export default function Contact() {
  useDocumentTitle('Contact us')
  const { user } = useAuth()
  const id = useId()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState<string | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const errs: Record<string, string> = {}
    if (!d.name?.trim()) errs.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email?.trim() ?? '')) errs.email = 'Enter a valid email so we can reply.'
    if ((d.message?.trim().length ?? 0) < 10) errs.message = 'A little more detail helps us help you (10+ characters).'
    setErrors(errs)
    if (Object.keys(errs).length) return
    // PLACEHOLDER: send to your helpdesk (Gorgias, Zendesk, a form endpoint…).
    setSent(d.name.trim().split(' ')[0])
  }

  return (
    <InfoLayout eyebrow="Help · Contact" title="Talk to a keeper" description="Questions about gear, an order or your bees — we answer every message, usually within one business day." crumb="Contact" seed={14}>
      <div className="grid gap-10 xl:grid-cols-[1.3fr_0.7fr]">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} role="status" className="flex flex-col items-start gap-4 border-2 border-ink bg-leaf/15 p-8">
              <PixelSprite sprite={BEE_SIDE_A} scale={4} className="animate-bob" />
              <h2 className="text-3xl font-semibold">Thanks, {sent} — message received.</h2>
              <p className="text-ink-soft">We’ll reply to your email within one business day. While you wait, the FAQ might already have your answer.</p>
              <Button asChild variant="paper"><Link to="/faq">Browse the FAQ</Link></Button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${id}-n`}>Name</Label>
                <Input id={`${id}-n`} name="name" autoComplete="name" defaultValue={user?.name} aria-invalid={Boolean(errors.name)} />
                {errors.name && <p className="text-sm font-semibold text-poppy">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-e`}>Email</Label>
                <Input id={`${id}-e`} name="email" type="email" autoComplete="email" defaultValue={user?.email} aria-invalid={Boolean(errors.email)} />
                {errors.email && <p className="text-sm font-semibold text-poppy">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-t`}>Topic</Label>
                <select id={`${id}-t`} name="topic" className="h-12 w-full border-2 border-ink bg-paper px-3 font-semibold">
                  {TOPICS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-o`}>Order number (optional)</Label>
                <Input id={`${id}-o`} name="order" placeholder="YS-123456" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`${id}-m`}>Message</Label>
                <textarea id={`${id}-m`} name="message" rows={6} aria-invalid={Boolean(errors.message)} className="w-full border-2 border-ink bg-paper px-3.5 py-3 text-ink focus-visible:shadow-[0_0_0_3px_var(--color-honey)] focus-visible:outline-none aria-[invalid=true]:border-poppy" />
                {errors.message && <p className="text-sm font-semibold text-poppy">{errors.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg">Send message</Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <aside className="space-y-4">
          {[
            { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
            { icon: Phone, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phone.replace(/[^\d+]/g, '')}` },
            { icon: Clock, label: 'Hours', value: SITE.hours },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-4 border-2 border-ink bg-paper p-5">
              <c.icon className="mt-0.5 size-5 text-honey-deep" aria-hidden="true" />
              <div>
                <p className="font-pixel text-[0.6rem] text-muted">{c.label}</p>
                {c.href ? <a href={c.href} className="font-bold hover:underline">{c.value}</a> : <p className="font-bold">{c.value}</p>}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </InfoLayout>
  )
}
