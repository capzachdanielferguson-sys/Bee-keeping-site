import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

/** Accessible disclosure list with a pixel +/− marker and height animation. */
export function Accordion({
  items,
  className,
  defaultOpen = -1,
}: {
  items: { q: string; a: React.ReactNode }[]
  className?: string
  defaultOpen?: number
}) {
  const [open, setOpen] = useState<number>(defaultOpen)
  const id = useId()
  return (
    <ul className={cn('divide-y-2 divide-dashed divide-ink/15 border-y-2 border-ink', className)}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <li key={item.q}>
            <h3 className="font-sans text-base tracking-normal">
              <button
                type="button"
                id={`${id}-h-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-bold text-ink hover:text-ink-soft"
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className={cn(
                    'relative grid size-7 shrink-0 place-items-center transition-colors',
                    isOpen ? 'bg-honey' : 'bg-ink/5',
                  )}
                >
                  <span className="absolute h-[3px] w-3 bg-ink" />
                  <span className={cn('absolute h-3 w-[3px] bg-ink transition-transform', isOpen && 'scale-y-0')} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-p-${i}`}
                  role="region"
                  aria-labelledby={`${id}-h-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="max-w-[68ch] pb-6 pr-10 leading-relaxed text-ink-soft">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
