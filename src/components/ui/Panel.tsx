import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type PanelProps = HTMLAttributes<HTMLDivElement>

export function Panel({ className, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-transparent bg-surfaceContainer shadow-e2',
        className,
      )}
      {...props}
    />
  )
}
