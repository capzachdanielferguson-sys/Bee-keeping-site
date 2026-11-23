import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { readStorage, writeStorage } from '@/lib/utils'

/**
 * Demo account state. This is a front-end stand-in so the sign-up / log-in
 * flows are fully clickable — swap `signUp` / `logIn` for your real auth
 * provider (Shopify customer accounts, Supabase, Clerk, …). Passwords are
 * never stored.
 */

export interface User {
  name: string
  email: string
  joined: string
}

export type AuthMode = 'login' | 'signup'

interface AuthContextValue {
  user: User | null
  dialogOpen: boolean
  dialogMode: AuthMode
  openAuth: (mode?: AuthMode) => void
  setDialogOpen: (open: boolean) => void
  setDialogMode: (mode: AuthMode) => void
  signUp: (input: { name: string; email: string }) => Promise<User>
  logIn: (input: { email: string }) => Promise<User>
  logOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const USER_KEY = 'ys_user_v1'
const ACCOUNTS_KEY = 'ys_accounts_v1'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStorage<User | null>(USER_KEY, null))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<AuthMode>('signup')

  const persist = (u: User | null) => {
    setUser(u)
    writeStorage(USER_KEY, u)
  }

  const signUp = useCallback(async ({ name, email }: { name: string; email: string }) => {
    await wait(700)
    const accounts = readStorage<User[]>(ACCOUNTS_KEY, [])
    const normalized = email.trim().toLowerCase()
    if (accounts.some((a) => a.email === normalized)) {
      throw new Error('That email already has an account — try logging in instead.')
    }
    const u: User = { name: name.trim(), email: normalized, joined: new Date().toISOString() }
    writeStorage(ACCOUNTS_KEY, [...accounts, u])
    persist(u)
    return u
  }, [])

  const logIn = useCallback(async ({ email }: { email: string }) => {
    await wait(600)
    const accounts = readStorage<User[]>(ACCOUNTS_KEY, [])
    const found = accounts.find((a) => a.email === email.trim().toLowerCase())
    if (!found) throw new Error('We couldn’t find an account with that email. Want to sign up?')
    persist(found)
    return found
  }, [])

  const logOut = useCallback(() => persist(null), [])

  const openAuth = useCallback((mode: AuthMode = 'login') => {
    setDialogMode(mode)
    setDialogOpen(true)
  }, [])

  const value = useMemo(
    () => ({ user, dialogOpen, dialogMode, openAuth, setDialogOpen, setDialogMode, signUp, logIn, logOut }),
    [user, dialogOpen, dialogMode, openAuth, signUp, logIn, logOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
