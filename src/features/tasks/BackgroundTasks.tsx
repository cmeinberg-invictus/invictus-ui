import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { useAppState } from '../../store/AppStateProvider'

type BackgroundTasksProps = {
  activityId: string | null
}

export function BackgroundTasks({ activityId }: BackgroundTasksProps) {
  const { tasks, clearCompletedTasks } = useAppState()

  const filteredTasks = activityId ? tasks.filter((task) => task.activityId === activityId) : tasks

  return (
    <section aria-labelledby="background-tasks-title" className="space-y-3">
      <header className="flex items-center justify-between">
        <h2 id="background-tasks-title" className="text-sm font-semibold text-text">
          Background tasks
        </h2>
        <Button size="sm" variant="tertiary" onClick={clearCompletedTasks}>
          Clear
        </Button>
      </header>

      {filteredTasks.length ? (
        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <Card variant="default" className="space-y-1.5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-text">{task.title}</p>
                  <Badge status={task.status} />
                </div>
                <p className="text-xs text-textMuted">{task.subtitle}</p>
                <p className="text-xs text-textMuted">{task.updatedAt}</p>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No background tasks" description="Running jobs will appear here." />
      )}
    </section>
  )
}
