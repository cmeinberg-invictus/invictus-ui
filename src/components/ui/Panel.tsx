import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type PanelProps = HTMLAttributes<HTMLDivElement>

export function Panel({ className, ...props }: PanelProps) {
  return (
    <div
      className={cn('rounded-lg border border-border bg-surface shadow-panel', className)}
      {...props}
    />
  )
}
