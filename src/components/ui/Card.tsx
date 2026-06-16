import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type CardVariant = 'default' | 'snippet' | 'reasoning' | 'evidence' | 'followUp'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant
}

const variantClasses: Record<CardVariant, string> = {
  default: 'border-[color:var(--surface-border)] bg-surfaceContainerLow text-text shadow-e1',
  snippet: 'border-[color:var(--surface-border)] bg-surfaceContainer text-text shadow-e1',
  reasoning: 'border-transparent bg-primaryContainer/70 text-onPrimaryContainer shadow-e1',
  evidence: 'border-transparent bg-successContainer text-onSuccessContainer shadow-e1',
  followUp: 'border-transparent bg-warningContainer text-onWarningContainer shadow-e1',
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-xl border p-4 transition-colors',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
