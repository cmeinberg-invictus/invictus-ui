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
        'inline-flex h-9 items-center gap-2 rounded-pill border border-border bg-surface px-3 text-xs font-semibold text-text transition hover:border-accent/45 hover:bg-accentSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        className,
      )}
      {...props}
    >
      {icon ? <Icon name={icon} className="h-3.5 w-3.5 text-accent" /> : null}
      <span>{children}</span>
    </button>
  )
}
