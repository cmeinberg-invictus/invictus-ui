import { ButtonLink } from '../components/ui/ButtonLink'
import { Panel } from '../components/ui/Panel'
import { useAppState } from '../store/AppStateProvider'

export function HomePage() {
  const { activities } = useAppState()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="type-headline text-headline-sm font-medium text-text">Verena by Invictus AI</h1>
        <p className="mt-2 max-w-2xl text-body-md text-textMuted">
          A focused workspace for guided conversations, tasks, and trustworthy outcomes.
        </p>
      </header>

      <Panel className="overflow-hidden">
        <div className="border-b border-[color:var(--surface-border)] px-5 py-4">
          <h2 className="type-title text-title-md font-medium text-text">Resume recent activity</h2>
        </div>
        <ul className="divide-y divide-[color:var(--surface-border)]">
          {activities.slice(0, 3).map((activity) => (
            <li key={activity.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-body-md font-medium text-text">{activity.title}</p>
                <p className="text-label-md text-textMuted">{activity.updatedAt}</p>
              </div>
              <ButtonLink
                to={`/activities/${activity.id}`}
                variant="tonal"
                size="sm"
              >
                Open
              </ButtonLink>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
