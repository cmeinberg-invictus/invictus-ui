import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'glass' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon-md' | 'icon-lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accentStrong active:brightness-110',
  secondary:
    'border border-composerBorder bg-surfaceAlt/90 text-text hover:border-accent/40 hover:bg-accentSoft/70 active:bg-surface',
  tertiary: 'bg-transparent text-textMuted hover:bg-surfaceAlt hover:text-text',
  glass: 'chat-glass-input text-text hover:bg-accentSoft/55 active:bg-accentSoft/70',
  ghost: 'bg-transparent text-textMuted hover:bg-surfaceAlt hover:text-text',
  danger: 'bg-danger text-white hover:brightness-110',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
  'icon-sm': 'h-8 w-8 p-0 text-xs',
  'icon-md': 'h-10 w-10 p-0 text-sm',
  'icon-lg': 'h-11 w-11 p-0 text-sm',
}

export function Button({
  className,
  variant = 'secondary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40',
        variantClasses[variant],
        sizeClasses[size],
        size.startsWith('icon') && 'rounded-full',
        className,
      )}
      {...props}
    />
  )
}
