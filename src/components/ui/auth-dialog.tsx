'use client'

/**
 * Auth Dialog — adapted from 21st.dev "Auth Dialog" by ruixen.ui
 * (https://21st.dev/@ruixen.ui/components/auth-dialog).
 *
 * Kept from the original: one surface that toggles between Sign up and
 * Login without a second dialog, Full-name field only on sign up, password
 * show/hide with Lucide Eye/EyeOff, "Continue with Google", and the terms
 * note on sign up.
 *
 * Added for yourstripes: a sliding pill mode switch (motion layoutId),
 * animated field + heading transitions, pixel-heart password strength,
 * validation with an error shake, a loading state, and a success screen.
 */

import { useEffect, useId, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { Link } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PixelSprite } from '@/components/pixel/PixelSprite'
import { BEE_TOP, HEART, HEART_EMPTY } from '@/components/pixel/sprites'
import { burst } from '@/components/pixel/ClickSparks'
import { useAuth, type AuthMode } from '@/store/auth'
import { cn } from '@/lib/utils'

const COPY: Record<AuthMode, { title: string; description: string; cta: string }> = {
  signup: {
    title: 'Join the colony',
    description: 'Save your gear list, track orders and get our first-season keeper guide.',
    cta: 'Create account',
  },
  login: {
    title: 'Welcome back',
    description: 'Log in to check orders and pick up where you left off.',
    cta: 'Log in',
  },
}

function passwordScore(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const SCORE_LABEL = ['Too weak', 'Weak', 'Okay', 'Good', 'Strong', 'Queen-grade']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function AuthForm({
  mode,
  onModeChange,
  onDone,
  headingAs = 'dialog',
}: {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onDone?: () => void
  /** "dialog" uses Radix Title/Description so the dialog is labelled. */
  headingAs?: 'dialog' | 'page'
}) {
  const { signUp, logIn } = useAuth()
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [welcome, setWelcome] = useState<string | null>(null)
  const shake = useAnimationControls()

  useEffect(() => {
    setError(null)
    setInfo(null)
    setFieldErrors({})
  }, [mode])

  const score = passwordScore(password)
  const copy = COPY[mode]

  const toggleMode = () => onModeChange(mode === 'signup' ? 'login' : 'signup')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    const errs: Record<string, string> = {}
    if (mode === 'signup' && name.trim().length < 2) errs.name = 'Tell us what to call you.'
    if (!EMAIL_RE.test(email.trim())) errs.email = 'That email doesn’t look right.'
    if (password.length < 8) errs.password = 'Use at least 8 characters.'
    setFieldErrors(errs)
    if (Object.keys(errs).length) {
      shake.start({ x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.42 } })
      return
    }
    setLoading(true)
    try {
      const user = mode === 'signup' ? await signUp({ name, email }) : await logIn({ email })
      setWelcome(user.name.split(' ')[0] || user.name)
      const r = document.activeElement?.getBoundingClientRect()
      burst(r ? r.left + r.width / 2 : window.innerWidth / 2, r ? r.top : window.innerHeight / 2, { big: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
      shake.start({ x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.42 } })
    } finally {
      setLoading(false)
    }
  }

  const Title = headingAs === 'dialog' ? DialogTitle : 'h1'
  const Description = headingAs === 'dialog' ? DialogDescription : 'p'

  if (welcome) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center py-4 text-center"
        role="status"
      >
        <div className="relative mb-5 grid size-24 place-items-center bg-honey px-notch">
          <PixelSprite sprite={BEE_TOP} scale={6} className="animate-bob" />
        </div>
        <p className="font-pixel text-xs text-honey-deep">Achievement unlocked</p>
        <Title className="mt-2 font-display text-3xl font-semibold">
          {mode === 'signup' ? `Welcome to the colony, ${welcome}!` : `Good to see you, ${welcome}.`}
        </Title>
        <Description className="mt-2 max-w-sm text-ink-soft">
          {mode === 'signup'
            ? 'Your account is ready. Your first-season keeper guide is on its way to your inbox.'
            : 'You’re logged in. Your cart and saved gear are right where you left them.'}
        </Description>
        <Button className="mt-6" onClick={onDone}>
          Start shopping
        </Button>
      </motion.div>
    )
  }

  return (
    <div>
      {/* Mode switch — sliding pill */}
      <div role="tablist" aria-label="Account" className="mb-6 grid grid-cols-2 border-2 border-ink bg-wax/60 p-1">
        {(['login', 'signup'] as const).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => onModeChange(m)}
            className={cn(
              'relative h-10 text-sm font-bold transition-colors',
              mode === m ? 'text-ink' : 'text-ink/60 hover:text-ink',
            )}
          >
            {mode === m && (
              <motion.span
                layoutId={`auth-pill-${headingAs}`}
                className="absolute inset-0 bg-honey shadow-[inset_0_-3px_0_rgb(0_0_0/0.12)]"
                transition={{ type: 'spring', stiffness: 520, damping: 38 }}
              />
            )}
            <span className="relative">{m === 'login' ? 'Log in' : 'Sign up'}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="mb-6"
        >
          <Title className={cn('font-display font-semibold', headingAs === 'page' ? 'text-4xl sm:text-5xl' : 'text-3xl')}>
            {copy.title}
          </Title>
          <Description className="mt-2 text-ink-soft">{copy.description}</Description>
        </motion.div>
      </AnimatePresence>

      <motion.form animate={shake} onSubmit={onSubmit} noValidate className="space-y-4">
        <AnimatePresence initial={false}>
          {mode === 'signup' && (
            <motion.div
              key="name"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pb-1">
                <Label htmlFor={`${id}-name`}>Full name</Label>
                <Input
                  id={`${id}-name`}
                  placeholder="Ada Comb"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? `${id}-name-err` : undefined}
                />
                {fieldErrors.name && (
                  <p id={`${id}-name-err`} className="text-sm font-semibold text-poppy">
                    {fieldErrors.name}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <Label htmlFor={`${id}-email`}>Email</Label>
          <Input
            id={`${id}-email`}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? `${id}-email-err` : undefined}
          />
          {fieldErrors.email && (
            <p id={`${id}-email-err`} className="text-sm font-semibold text-poppy">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor={`${id}-password`}>Password</Label>
            {mode === 'login' && (
              <button
                type="button"
                className="text-sm font-semibold text-ink-soft underline decoration-2 underline-offset-4 hover:text-ink hover:decoration-honey"
                onClick={() =>
                  setInfo(
                    EMAIL_RE.test(email.trim())
                      ? `If an account exists for ${email.trim()}, a reset link is on its way.`
                      : 'Enter your email above and we’ll send a reset link.',
                  )
                }
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <Input
              id={`${id}-password`}
              placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-12"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={`${id}-pw-help`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center text-ink/60 hover:text-ink"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div id={`${id}-pw-help`}>
            {fieldErrors.password ? (
              <p className="text-sm font-semibold text-poppy">{fieldErrors.password}</p>
            ) : mode === 'signup' ? (
              <div className="flex items-center gap-3" aria-live="polite">
                <div className="flex gap-1" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <PixelSprite key={i} sprite={i < score ? HEART : HEART_EMPTY} scale={2} />
                  ))}
                </div>
                <span className="font-pixel text-[0.65rem] text-muted">
                  Hive strength: {password ? SCORE_LABEL[score] : '—'}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <AnimatePresence>
          {(error || info) && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              role={error ? 'alert' : 'status'}
              className={cn(
                'overflow-hidden border-l-4 px-3 py-2 text-sm font-semibold',
                error ? 'border-poppy bg-poppy/10 text-[#9c2a21]' : 'border-meadow bg-leaf/15 text-meadow-deep',
              )}
            >
              {error ?? info}
            </motion.p>
          )}
        </AnimatePresence>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-1.5" aria-label="Working">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-2 animate-blink bg-ink" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </span>
          ) : (
            copy.cta
          )}
        </Button>
      </motion.form>

      <div className="mt-5 text-center text-sm text-ink-soft">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <button className="font-bold text-ink underline decoration-2 underline-offset-4 hover:decoration-honey" onClick={toggleMode}>
              Log in
            </button>
          </>
        ) : (
          <>
            New to yourstripes?{' '}
            <button className="font-bold text-ink underline decoration-2 underline-offset-4 hover:decoration-honey" onClick={toggleMode}>
              Sign up
            </button>
          </>
        )}
      </div>

      <div className="my-5 flex items-center gap-3 before:h-0.5 before:flex-1 before:bg-ink/15 after:h-0.5 after:flex-1 after:bg-ink/15">
        <span className="font-pixel text-[0.65rem] text-muted">Or</span>
      </div>
      <Button
        variant="paper"
        className="w-full"
        type="button"
        onClick={() => setInfo('Google sign-in switches on once the store’s Google OAuth client is connected.')}
      >
        <GoogleMark />
        Continue with Google
      </Button>

      {mode === 'signup' && (
        <p className="mt-4 text-center text-xs text-muted">
          By signing up you agree to our{' '}
          <Link to="/terms" className="underline hover:no-underline" onClick={onDone}>
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:no-underline" onClick={onDone}>
            Privacy Policy
          </Link>
          .
        </p>
      )}
    </div>
  )
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.8-3.8h-4v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.2 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8z" />
    </svg>
  )
}

/** The global auth dialog, driven by the auth store (header, checkout, etc.). */
export default function AuthDialog() {
  const { dialogOpen, setDialogOpen, dialogMode, setDialogMode } = useAuth()
  // Remount the form each time the dialog opens so it starts clean.
  const [session, setSession] = useState(0)
  useEffect(() => {
    if (dialogOpen) setSession((s) => s + 1)
  }, [dialogOpen])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <AuthForm key={session} mode={dialogMode} onModeChange={setDialogMode} onDone={() => setDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
