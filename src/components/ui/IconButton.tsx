import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type IconButtonVariant = 'default' | 'glass'
type IconButtonSize = 'sm' | 'md' | 'lg'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant
  size?: IconButtonSize
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
}

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    'bg-controlNeutral text-[color:var(--color-text)] hover:brightness-110 active:brightness-95',
  glass:
    'chat-glass-input text-text hover:bg-accentSoft/55 active:bg-accentSoft/70',
}

export function IconButton({
  className,
  type = 'button',
  variant = 'default',
  size = 'md',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
