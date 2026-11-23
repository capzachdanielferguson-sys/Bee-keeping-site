import * as React from 'react'

import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

/** Input — shadcn/21st.dev registry base with square pixel framing. */
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full border-2 border-ink bg-paper px-3.5 py-2 text-[0.95rem] text-ink shadow-[inset_0_3px_0_rgb(23_32_15/0.06)] transition-[box-shadow,background-color] placeholder:text-muted/70 focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_var(--color-honey)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-poppy aria-[invalid=true]:shadow-[0_0_0_3px_rgb(232_72_60/0.25)]',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
