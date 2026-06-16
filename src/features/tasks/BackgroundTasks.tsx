import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Panel } from '../../components/ui/Panel'
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
        <h2 id="background-tasks-title" className="text-title-sm font-medium text-text">
          Background tasks
        </h2>
        <Button size="sm" variant="tertiary" onClick={clearCompletedTasks}>
          Clear
        </Button>
      </header>

      {filteredTasks.length ? (
        <Panel className="overflow-hidden border-[color:var(--surface-border)] bg-surfaceContainerLow">
          <ul className="divide-y divide-[color:var(--surface-border)]">
          {filteredTasks.map((task) => (
            <li key={task.id} className="space-y-1.5 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-body-md font-medium text-text">{task.title}</p>
                  <Badge status={task.status} />
                </div>
                <p className="text-label-md text-textMuted">{task.subtitle}</p>
                <p className="text-label-md text-textMuted">{task.updatedAt}</p>
            </li>
          ))}
          </ul>
        </Panel>
      ) : (
        <EmptyState title="No background tasks" description="Running jobs will appear here." />
      )}
    </section>
  )
}
