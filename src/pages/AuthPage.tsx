import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthForm } from '@/components/ui/auth-dialog'
import { PixelScene } from '@/components/pixel/PixelScenery'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { HEART, HONEY_DROP, SPARKLE } from '@/components/pixel/sprites'
import { useDocumentTitle } from '@/lib/hooks'
import type { AuthMode } from '@/store/auth'

const PERKS = [
  { sprite: HONEY_DROP, text: 'Free first-season keeper guide, by email' },
  { sprite: HEART, text: 'Order history and one-click reorders' },
  { sprite: SPARKLE, text: 'Early access to restocks and new gear' },
]

/** Full-page sign up / log in: pixel landscape on the left, the 21st.dev auth form on the right. */
export default function AuthPage({ mode: initial }: { mode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initial)
  const navigate = useNavigate()
  useDocumentTitle(mode === 'signup' ? 'Sign up' : 'Log in')

  return (
    <div className="grid min-h-[100svh] lg:grid-cols-2">
      <PixelScene className="hidden lg:block" seed={23} bees={5} meadowGround="#173d1f">
        <div className="flex min-h-[100svh] flex-col justify-center px-12 pb-44 pt-32 xl:px-20">
          <div className="max-w-md px-shadow">
            <div className="px-frame px-notch-2">
              <div className="px-fill px-notch-2 bg-paper/[0.97] p-8">
                <p className="font-pixel text-xs text-honey-deep">Player 2 has joined</p>
                <p className="mt-3 font-display text-4xl font-semibold leading-tight">
                  Your hive notes, orders and gear list — in one place.
                </p>
                <ul className="mt-6 space-y-3">
                  {PERKS.map((p) => (
                    <li key={p.text} className="flex items-center gap-3 font-semibold text-ink-soft">
                      <PixelSprite sprite={p.sprite} scale={3} />
                      {p.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </PixelScene>
      <div className="flex items-center justify-center px-4 pb-16 pt-28 sm:px-8 lg:pt-32">
        <div className="w-full max-w-md">
          <AuthForm
            headingAs="page"
            mode={mode}
            onModeChange={(m) => {
              setMode(m)
              navigate(m === 'signup' ? '/signup' : '/login', { replace: true })
            }}
            onDone={() => navigate('/account')}
          />
        </div>
      </div>
    </div>
  )
}
