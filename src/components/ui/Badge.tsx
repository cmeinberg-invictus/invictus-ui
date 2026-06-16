import type { TaskStatus } from '../../types/domain'
import { cn } from '../../lib/cn'

type BadgeProps = {
  status?: TaskStatus
  label?: string
  channel?: 'agent' | 'system' | 'customer'
  emphasis?: 'low' | 'medium' | 'high'
}

const styleByStatus: Record<TaskStatus, string> = {
  running: 'bg-warningContainer text-onWarningContainer',
  completed: 'bg-successContainer text-onSuccessContainer',
  failed: 'bg-errorContainer text-onErrorContainer',
}

const textByStatus: Record<TaskStatus, string> = {
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
}

const roleStyleByEmphasis: Record<'low' | 'medium' | 'high', string> = {
  low: 'bg-surfaceContainerHigh text-textMuted',
  medium: 'bg-secondaryContainer text-onSecondaryContainer',
  high: 'bg-primary text-onPrimary',
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
        ? 'bg-surfaceContainerHigh text-text'
        : 'bg-surfaceContainerLow text-textMuted'

  const text = label ?? (status ? textByStatus[status] : 'Badge')

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-medium',
        status ? styleByStatus[status] : roleClass,
      )}
    >
      {text}
    </span>
  )
}
