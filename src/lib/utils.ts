import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const usdWhole = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

/** Format a price in USD; whole-dollar amounts drop the cents. */
export function formatPrice(amount: number) {
  return Number.isInteger(amount) ? usdWhole.format(amount) : usd.format(amount)
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

/** Resolve a file in /public relative to the app base (works under sub-paths). */
export function asset(path: string) {
  const base = import.meta.env.BASE_URL || '/'
  return `${base.endsWith('/') ? base : base + '/'}${path.replace(/^\//, '')}`
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode / blocked) — state stays in memory */
  }
}

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

/** "Ten" instead of "10" in running copy (falls back to digits above twelve). */
export function numberWord(n: number, capitalize = false) {
  const w = WORDS[n] ?? String(n)
  return capitalize ? w.charAt(0).toUpperCase() + w.slice(1) : w
}
