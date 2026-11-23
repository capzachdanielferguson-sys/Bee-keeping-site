import { useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { readStorage, writeStorage } from '@/lib/utils'

type Consent = 'all' | 'essential'

export function CookieBanner() {
  const [consent, setConsent] = useState<Consent | null>(() => readStorage<Consent | null>('ys_cookie_consent_v1', null))

  const choose = (c: Consent) => {
    writeStorage('ys_cookie_consent_v1', c)
    setConsent(c)
  }

  return (
    <AnimatePresence>
      {!consent && (
        <motion.div
          role="region"
          aria-label="Cookie preferences"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 1.2 } }}
          exit={{ y: 40, opacity: 0 }}
          className="fixed bottom-3 left-3 right-3 z-[95] sm:left-5 sm:right-auto sm:max-w-sm"
        >
          <div className="px-shadow">
            <div className="px-frame px-notch">
              <div className="px-fill px-notch bg-paper p-4">
                <p className="font-pixel text-[0.65rem] text-honey-deep">Cookies</p>
                <p className="mt-1.5 text-sm text-ink-soft">
                  We use essential cookies to keep your cart and account working, and optional ones to understand what
                  keepers look for. <Link to="/cookies" className="font-semibold text-ink underline">Cookie policy</Link>
                </p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => choose('all')} className="btn-px h-10 flex-1 px-3 text-sm font-bold">
                    Accept all
                  </button>
                  <button
                    type="button"
                    onClick={() => choose('essential')}
                    className="btn-px btn-px--paper h-10 flex-1 px-3 text-sm font-bold"
                  >
                    Essential only
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
