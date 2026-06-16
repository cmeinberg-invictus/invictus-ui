import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type CardVariant = 'default' | 'snippet' | 'reasoning' | 'evidence' | 'followUp'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant
}

const variantClasses: Record<CardVariant, string> = {
  default: 'border-composerBorder bg-surface/94',
  snippet: 'chat-glass-input',
  reasoning: 'border-accent/35 bg-accentSoft/70',
  evidence: 'border-success/40 bg-success/10',
  followUp: 'border-warning/40 bg-warning/10',
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-xl border p-4 shadow-panel transition',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
