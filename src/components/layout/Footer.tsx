import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, Mail, Phone, Clock } from 'lucide-react'

import { InstagramIcon, Logo, PinterestIcon, TikTokIcon, YouTubeIcon } from '@/components/brand'
import { PixelMeadow } from '@/components/pixel/PixelScenery'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { HEART, BEE_SIDE_A } from '@/components/pixel/sprites'
import { burst } from '@/components/pixel/ClickSparks'
import { FOOTER_COLUMNS, SITE } from '@/data/site'
import { readStorage, writeStorage } from '@/lib/utils'

const YEAR = new Date().getFullYear()

const PAYMENTS = ['Visa', 'Mastercard', 'Amex', 'Discover', 'Apple Pay', 'Google Pay', 'PayPal']

function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>(() =>
    readStorage<boolean>('ys_newsletter_v1', false) ? 'done' : 'idle',
  )

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState('error')
      return
    }
    // PLACEHOLDER: post to your email provider (Klaviyo, Mailchimp, Shopify Email…).
    writeStorage('ys_newsletter_v1', true)
    setState('done')
    const btn = e.currentTarget.querySelector('button')?.getBoundingClientRect()
    if (btn) burst(btn.left + btn.width / 2, btn.top + btn.height / 2, { big: true })
  }

  return (
    <div className="max-w-md">
      <p className="font-pixel text-xs text-honey">The keeper’s letter</p>
      <h2 className="mt-2 text-3xl font-semibold text-cream sm:text-4xl">Join the colony.</h2>
      <p className="mt-3 text-cream/75">
        One email a month: what to do in your hive this season, new gear, and the occasional restock alert. No spam —
        bees hate it too.
      </p>
      <AnimatePresence mode="wait" initial={false}>
        {state === 'done' ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className="mt-5 flex items-center gap-3 bg-leaf/15 px-4 py-3 font-semibold text-cream"
          >
            <PixelSprite sprite={BEE_SIDE_A} scale={2} />
            You’re in. Watch your inbox for this month’s hive notes.
          </motion.p>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate className="mt-5">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <div className="flex gap-2">
              <input
                id="footer-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (state === 'error') setState('idle')
                }}
                aria-invalid={state === 'error'}
                aria-describedby={state === 'error' ? 'footer-email-err' : undefined}
                className="h-12 min-w-0 flex-1 border-2 border-cream/30 bg-ink/40 px-3.5 text-cream placeholder:text-cream/40 focus-visible:border-honey focus-visible:outline-none"
              />
              <button type="submit" className="btn-px h-12 px-5 text-sm font-bold">
                Subscribe
              </button>
            </div>
            {state === 'error' && (
              <p id="footer-email-err" className="mt-2 text-sm font-semibold text-petal">
                Please enter a valid email address.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative mt-24 text-cream">
      <PixelMeadow ground="#173d1f" seed={33} density={0.65} />
      <div className="bg-meadow-deep">
        <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-8 sm:px-8 lg:pt-12">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr] lg:gap-16">
            <Newsletter />
            <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.title}>
                  <h3 className="font-pixel text-xs font-normal tracking-wider text-honey">{col.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link to={l.to} className="text-[0.95rem] text-cream/80 transition-colors hover:text-honey-light">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-14 grid gap-8 border-t-2 border-dashed border-cream/15 pt-8 md:grid-cols-[auto_1fr_auto] md:items-center">
            <Link to="/" aria-label="yourstripes home">
              <Logo tone="cream" />
            </Link>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/75 md:justify-center">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-honey" aria-hidden="true" />
                <a href={`mailto:${SITE.email}`} className="hover:text-honey-light">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-honey" aria-hidden="true" />
                <a href={`tel:${SITE.phone.replace(/[^\d+]/g, '')}`} className="hover:text-honey-light">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-honey" aria-hidden="true" />
                {SITE.hours}
              </li>
            </ul>
            <ul className="flex items-center gap-2" aria-label="Social media">
              {[
                { label: 'Instagram', href: SITE.socials.instagram, icon: <InstagramIcon /> },
                { label: 'TikTok', href: SITE.socials.tiktok, icon: <TikTokIcon /> },
                { label: 'YouTube', href: SITE.socials.youtube, icon: <YouTubeIcon /> },
                { label: 'Pinterest', href: SITE.socials.pinterest, icon: <PinterestIcon /> },
              ].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={`yourstripes on ${s.label}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="grid size-10 place-items-center bg-cream/10 text-cream transition-colors hover:bg-honey hover:text-ink"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-6 border-t-2 border-dashed border-cream/15 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
              {PAYMENTS.map((p) => (
                <li key={p} className="font-pixel bg-cream px-2 py-1 text-[0.6rem] text-ink">
                  {p}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-cream/60">
              <p>© {YEAR} yourstripes. All rights reserved.</p>
              <p>Prices in USD</p>
              <p className="flex items-center gap-2">
                Made for bees <PixelSprite sprite={HEART} scale={2} />
              </p>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0 })}
                className="flex items-center gap-2 font-semibold text-cream/80 hover:text-honey-light"
              >
                <ArrowUp className="size-4" aria-hidden="true" /> Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
