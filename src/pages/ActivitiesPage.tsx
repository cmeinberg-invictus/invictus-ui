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
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-text">Activities</h1>
        <p className="text-sm text-textMuted">Track and reopen your workspace sessions.</p>
      </header>

      <ul className="space-y-3">
        {activities.map((activity) => (
          <li key={activity.id}>
            <Panel className="p-4">
              <Link to={`/activities/${activity.id}`} className="focus-brand block rounded-lg p-1">
                <p className="text-sm font-semibold text-text">{activity.title}</p>
                <p className="mt-1 text-sm text-textMuted">{activity.excerpt}</p>
                <p className="mt-2 text-xs text-textMuted">Updated {activity.updatedAt}</p>
              </Link>
            </Panel>
          </li>
        ))}
      </ul>
    </div>
  )
}
