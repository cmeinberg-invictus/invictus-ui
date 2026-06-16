import { Link } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { NavItem } from '../../components/ui/NavItem'
import { useAppState } from '../../store/AppStateProvider'

type LeftNavProps = {
  onNavigate?: () => void
}

export function LeftNav({ onNavigate }: LeftNavProps) {
  const { activities } = useAppState()

  return (
    <nav className="flex h-full flex-col gap-5 p-4" aria-label="Primary">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-textMuted">Verena</p>
        <p className="text-xs text-textMuted">by Invictus AI</p>
      </div>

      <Button className="w-full justify-start" variant="secondary" onClick={onNavigate}>
        + New session
      </Button>

      <div className="space-y-1">
        <NavItem to="/" label="Home" onNavigate={onNavigate} />
        <NavItem to="/activities" label="Activities" onNavigate={onNavigate} />
        <NavItem to="/artifacts" label="Artifacts" onNavigate={onNavigate} />
        <NavItem to="/settings" label="User / settings" onNavigate={onNavigate} />
      </div>

      <section className="min-h-0 flex-1 overflow-hidden" aria-labelledby="left-nav-recent">
        <h2 id="left-nav-recent" className="mb-2 px-1 text-xs uppercase tracking-wide text-textMuted">
          Recents
        </h2>
        <ul className="scroll-area max-h-full space-y-1 overflow-y-auto pr-1">
          {activities.map((activity) => (
            <li key={activity.id}>
              <Link
                to={`/activities/${activity.id}`}
                onClick={onNavigate}
                className="block rounded-md px-2 py-2 text-sm text-textMuted transition hover:bg-surfaceAlt hover:text-text"
              >
                <p className="truncate font-medium text-text">{activity.title}</p>
                <p className="truncate text-xs">{activity.updatedAt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex items-center gap-2 rounded-md border border-border bg-surface p-2">
        <Avatar name="Claudio Meinberg" />
        <div>
          <p className="text-sm font-medium text-text">Claudio</p>
          <p className="text-xs text-textMuted">Product workspace</p>
        </div>
      </div>
    </nav>
  )
}
