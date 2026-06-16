import { Link } from 'react-router-dom'
import { Panel } from '../components/ui/Panel'
import { useAppState } from '../store/AppStateProvider'

export function HomePage() {
  const { activities } = useAppState()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-text">Verena by Invictus AI</h1>
        <p className="mt-2 max-w-2xl text-sm text-textMuted">
          A focused workspace for guided conversations, tasks, and trustworthy outcomes.
        </p>
      </header>

      <Panel className="p-5">
        <h2 className="text-base font-semibold text-text">Resume recent activity</h2>
        <ul className="mt-4 space-y-3">
          {activities.slice(0, 3).map((activity) => (
            <li
              key={activity.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-surfaceContainerHigh p-3"
            >
              <div>
                <p className="text-sm font-medium text-text">{activity.title}</p>
                <p className="text-xs text-textMuted">{activity.updatedAt}</p>
              </div>
              <Link
                to={`/activities/${activity.id}`}
                className="state-layer focus-brand inline-flex h-9 items-center justify-center rounded-pill bg-secondaryContainer px-4 text-sm font-medium text-onSecondaryContainer shadow-e1"
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
