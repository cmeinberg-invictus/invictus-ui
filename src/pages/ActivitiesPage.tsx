import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { Panel } from '../components/ui/Panel'
import { useAppState } from '../store/AppStateProvider'

export function ActivitiesPage() {
  const { activities } = useAppState()

  if (!activities.length) {
    return (
      <EmptyState
        title="No activities yet"
        description="Start a new activity from the left navigation to begin."
      />
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-headline-sm font-medium text-text">Activities</h1>
        <p className="text-body-md text-textMuted">Track and reopen your workspace sessions.</p>
      </header>

      <Panel className="overflow-hidden">
        <ul className="divide-y divide-[color:var(--surface-border)]">
          {activities.map((activity) => (
            <li key={activity.id}>
              <Link
                to={`/activities/${activity.id}`}
                className="focus-brand block px-5 py-4 transition-colors hover:bg-surfaceContainerHigh/50"
              >
                <p className="text-body-md font-medium text-text">{activity.title}</p>
                <p className="mt-1 text-body-md text-textMuted">{activity.excerpt}</p>
                <p className="mt-2 text-label-md text-textMuted">Updated {activity.updatedAt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
