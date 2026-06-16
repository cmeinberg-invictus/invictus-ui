import type { TaskStatus } from '../../types/domain'
import { cn } from '../../lib/cn'

type BadgeProps = {
  status: TaskStatus
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

export function Badge({ status }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
        styleByStatus[status],
      )}
    >
      {textByStatus[status]}
    </span>
  )
}
