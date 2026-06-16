import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type PillProps = HTMLAttributes<HTMLSpanElement> & {
  emphasis?: 'low' | 'medium' | 'high'
}

const emphasisClasses: Record<NonNullable<PillProps['emphasis']>, string> = {
  low: 'bg-surfaceContainerHigh text-textMuted',
  medium: 'bg-secondaryContainer text-onSecondaryContainer',
  high: 'bg-primary text-onPrimary',
}

export function Pill({ className, emphasis = 'medium', ...props }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex min-h-7 items-center rounded-pill px-3 text-xs font-medium',
        emphasisClasses[emphasis],
        className,
      )}
      {...props}
    />
  )
}
