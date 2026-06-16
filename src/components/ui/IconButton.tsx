import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type IconButtonVariant = 'default' | 'filled' | 'tonal' | 'outlined' | 'glass'
type IconButtonSize = 'sm' | 'md' | 'lg'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant
  size?: IconButtonSize
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    'bg-surfaceContainerHigh text-text shadow-e1 hover:bg-surfaceContainerHighest active:bg-surfaceContainer',
  filled: 'bg-primary text-onPrimary shadow-e1 hover:brightness-105 active:brightness-95',
  tonal:
    'bg-secondaryContainer text-onSecondaryContainer shadow-e1 hover:brightness-105 active:brightness-95',
  outlined:
    'border border-outlineVariant bg-surfaceContainer text-text shadow-none hover:bg-surfaceContainerHigh',
  glass:
    'border border-outlineVariant bg-surfaceContainerLow text-text shadow-e1 hover:bg-surfaceContainer active:bg-surfaceContainerLow',
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
        'state-layer inline-flex items-center justify-center rounded-full transition-[background-color,color,box-shadow,border-color,opacity] duration-150 ease-out focus-brand disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
