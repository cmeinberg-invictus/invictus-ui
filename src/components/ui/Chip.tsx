import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: 'spark' | 'clock'
}

export function Chip({ className, icon, children, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      className={cn(
        'state-layer inline-flex h-8 items-center gap-2 rounded-pill border border-outline bg-surfaceContainerLow px-3 text-xs font-medium text-text transition-colors focus-brand',
        className,
      )}
      {...props}
    >
      {icon ? <Icon name={icon} className="h-3.5 w-3.5 text-primary" /> : null}
      <span>{children}</span>
    </button>
  )
}
