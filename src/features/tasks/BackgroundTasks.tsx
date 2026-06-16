import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { useAppState } from '../../store/AppStateProvider'

type BackgroundTasksProps = {
  activityId: string | null
  variant?: 'standalone' | 'embedded'
}

export function BackgroundTasks({ activityId, variant = 'standalone' }: BackgroundTasksProps) {
  const { tasks, clearCompletedTasks } = useAppState()

  const filteredTasks = activityId ? tasks.filter((task) => task.activityId === activityId) : tasks

  const taskContent = filteredTasks.length ? (
    <div className="space-y-3">
      {variant === 'embedded' ? (
        <div className="flex justify-end">
          <Button size="sm" variant="tertiary" onClick={clearCompletedTasks}>
            Clear
          </Button>
        </div>
      ) : null}
      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--context-group-item-background)] px-3 py-3 shadow-e1"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="text-body-md font-medium text-text">{task.title}</p>
                <p className="text-label-md text-textMuted">{task.subtitle}</p>
                <p className="text-label-md text-textMuted">{task.updatedAt}</p>
              </div>
              <Badge status={task.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <EmptyState title="No background tasks" description="Running jobs will appear here." />
  )

  if (variant === 'embedded') {
    return taskContent
  }

  return (
    <section aria-labelledby="background-tasks-title" className="space-y-3">
      <header className="flex items-center justify-between">
        <h2 id="background-tasks-title" className="type-title text-title-sm font-medium text-text">
          Background tasks
        </h2>
        <Button size="sm" variant="tertiary" onClick={clearCompletedTasks}>
          Clear
        </Button>
      </header>

      {taskContent}
    </section>
  )
}
