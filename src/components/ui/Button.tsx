import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tonal'
  | 'tertiary'
  | 'glass'
  | 'ghost'
  | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon-md' | 'icon-lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-onPrimary shadow-e1 hover:brightness-105 active:brightness-95',
  secondary:
    'bg-surfaceContainerHigh text-text shadow-e1 hover:bg-surfaceContainerHighest active:bg-surfaceContainer',
  tonal:
    'bg-secondaryContainer text-onSecondaryContainer shadow-e1 hover:brightness-105 active:brightness-95',
  tertiary: 'bg-transparent text-textMuted hover:bg-surfaceContainerHigh hover:text-text shadow-none',
  glass:
    'border border-outlineVariant bg-surfaceContainerLow text-text shadow-e1 hover:bg-surfaceContainer active:bg-surfaceContainerLow',
  ghost: 'bg-transparent text-textMuted shadow-none hover:bg-surfaceContainerLow hover:text-text',
  danger: 'bg-error text-onError shadow-e1 hover:brightness-105 active:brightness-95',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-label-lg font-medium',
  md: 'h-10 px-5 text-label-lg font-medium',
  lg: 'h-12 px-6 text-body-md font-medium',
  'icon-sm': 'h-8 w-8 p-0 text-label-lg',
  'icon-md': 'h-10 w-10 p-0 text-label-lg',
  'icon-lg': 'h-12 w-12 p-0 text-body-md',
}

const baseButtonClassName =
  'state-layer inline-flex items-center justify-center gap-2 rounded-pill transition-[background-color,color,box-shadow,border-color,opacity] duration-150 ease-out focus-brand disabled:pointer-events-none disabled:opacity-50'

export function getButtonClassName({
  className,
  variant = 'secondary',
  size = 'md',
}: {
  className?: string
  variant?: ButtonVariant
  size?: ButtonSize
}) {
  return cn(
    baseButtonClassName,
    variantClasses[variant],
    sizeClasses[size],
    size.startsWith('icon') && 'rounded-full',
    className,
  )
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
      className={getButtonClassName({ className, variant, size })}
      {...props}
    />
  )
}
