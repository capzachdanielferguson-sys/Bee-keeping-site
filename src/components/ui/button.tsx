import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Button — shadcn/21st.dev registry base, restyled as a pixel "arcade"
 * button: notched ink frame, honey fill, hard drop shadow that collapses
 * on press. Labels stay in smooth Manrope type.
 */
const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-bold tracking-tight disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'btn-px',
        ink: 'btn-px btn-px--ink',
        paper: 'btn-px btn-px--paper',
        meadow: 'btn-px btn-px--meadow',
        ghost: 'text-ink hover:bg-ink/5 active:translate-y-px',
        link: 'text-ink underline decoration-2 underline-offset-4 hover:decoration-honey',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        default: 'h-11 px-5 text-[0.95rem]',
        lg: 'h-14 px-7 text-base',
        icon: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
