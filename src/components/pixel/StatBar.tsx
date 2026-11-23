import { cn } from '@/lib/utils'

/** Segmented pixel meter, like an RPG item-stat bar. */
export function StatBar({
  label,
  value,
  max = 10,
  tone = 'honey',
  className,
  compact = false,
}: {
  label: string
  value: number
  max?: number
  tone?: 'honey' | 'leaf' | 'sky'
  className?: string
  compact?: boolean
}) {
  const fill = tone === 'leaf' ? 'bg-leaf' : tone === 'sky' ? 'bg-sky' : 'bg-honey'
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className={cn('font-pixel shrink-0 text-ink-soft', compact ? 'w-[9.5rem] text-[0.6rem]' : 'w-40 text-[0.68rem]')}>
        {label}
      </span>
      <span
        className="flex flex-1 gap-[3px] border-2 border-ink bg-paper p-[2px]"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className={cn(compact ? 'h-2' : 'h-2.5', 'flex-1', i < value ? fill : 'bg-ink/10')} />
        ))}
      </span>
      <span className="font-pixel tabular w-6 text-right text-[0.68rem] text-ink">{value}</span>
    </div>
  )
}

/** Horizontal progress (XP) bar with pixel segments. */
export function XpBar({ value, max, segments = 20, className }: { value: number; max: number; segments?: number; className?: string }) {
  const filled = Math.round(Math.min(1, value / max) * segments)
  return (
    <span className={cn('flex gap-[2px] border-2 border-ink bg-paper p-[2px]', className)} aria-hidden="true">
      {Array.from({ length: segments }, (_, i) => (
        <span key={i} className={cn('h-2 flex-1', i < filled ? 'bg-leaf' : 'bg-ink/10')} />
      ))}
    </span>
  )
}
