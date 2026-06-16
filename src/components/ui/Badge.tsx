import type { TaskStatus } from '../../types/domain'
import { cn } from '../../lib/cn'

type BadgeProps = {
  status?: TaskStatus
  label?: string
  channel?: 'agent' | 'system' | 'customer'
  emphasis?: 'low' | 'medium' | 'high'
}

const styleByStatus: Record<TaskStatus, string> = {
  running: 'bg-warning/15 text-warning',
  completed: 'bg-success/15 text-success',
  failed: 'bg-danger/15 text-danger',
}

const textByStatus: Record<TaskStatus, string> = {
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
}

const roleStyleByEmphasis: Record<'low' | 'medium' | 'high', string> = {
  low: 'bg-accentSoft text-textMuted',
  medium: 'bg-surfaceAlt text-text',
  high: 'bg-accent text-white',
}

export function Badge({
  status,
  label,
  channel = 'system',
  emphasis = 'medium',
}: BadgeProps) {
  const roleClass =
    channel === 'agent'
      ? roleStyleByEmphasis[emphasis]
      : channel === 'customer'
        ? 'bg-surfaceAlt text-text'
        : 'bg-accentSoft text-textMuted'

  const text = label ?? (status ? textByStatus[status] : 'Badge')

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold',
        status ? styleByStatus[status] : roleClass,
      )}
    >
      {text}
    </span>
  )
}
