import { Link } from 'react-router-dom'
import { Panel } from '../components/ui/Panel'
import { useAppState } from '../store/AppStateProvider'

export function HomePage() {
  const { activities } = useAppState()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-text">Verena by Invictus AI</h1>
        <p className="mt-2 max-w-2xl text-sm text-textMuted">
          A multi-panel workspace for chat, activities, and background tasks.
        </p>
      </header>

      <Panel className="p-4">
        <h2 className="text-sm font-semibold text-text">Resume recent activity</h2>
        <ul className="mt-3 space-y-2">
          {activities.slice(0, 3).map((activity) => (
            <li key={activity.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-text">{activity.title}</p>
                <p className="text-xs text-textMuted">{activity.updatedAt}</p>
              </div>
              <Link
                to={`/activities/${activity.id}`}
                className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-surfaceAlt px-3 text-sm font-medium text-text transition hover:bg-surface"
              >
                Open
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
