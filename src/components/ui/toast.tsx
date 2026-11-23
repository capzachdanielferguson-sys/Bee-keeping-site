import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { asset } from '@/lib/utils'

interface Toast {
  id: number
  title: string
  description?: string
  image?: string
  action?: { label: string; onClick: () => void }
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const toast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = nextId.current++
      setToasts((prev) => [...prev.slice(-2), { ...t, id }])
      window.setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 left-1/2 z-[110] flex w-[min(420px,calc(100%-1.5rem))] -translate-x-1/2 flex-col gap-2"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 500, damping: 36 }}
              className="pointer-events-auto px-shadow"
            >
              <div className="px-frame px-notch">
                <div className="px-fill px-notch flex items-center gap-3 bg-paper p-3 pr-2">
                  {t.image && (
                    <img src={asset(t.image)} alt="" className="px-notch size-12 shrink-0 bg-card object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{t.title}</p>
                    {t.description && <p className="truncate text-xs text-muted">{t.description}</p>}
                  </div>
                  {t.action && (
                    <button
                      type="button"
                      onClick={() => {
                        t.action?.onClick()
                        dismiss(t.id)
                      }}
                      className="btn-px h-9 shrink-0 px-3 text-xs font-bold"
                      style={{ '--btn-lift': '3px' } as React.CSSProperties}
                    >
                      {t.action.label}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    className="grid size-8 shrink-0 place-items-center text-ink/60 hover:text-ink"
                    aria-label="Dismiss"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
