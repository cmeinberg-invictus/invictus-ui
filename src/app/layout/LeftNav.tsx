import { Link } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { NavItem } from '../../components/ui/NavItem'
import verenaLogoSymbol from '../../assets/verena-logo-symbol.svg'
import { useAppState } from '../../store/AppStateProvider'

type LeftNavProps = {
  onNavigate?: () => void
}

export function LeftNav({ onNavigate }: LeftNavProps) {
  const { activities } = useAppState()

  return (
    <nav className="flex h-full flex-col gap-6 bg-transparent p-4" aria-label="Primary">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <img src={verenaLogoSymbol} alt="" aria-hidden="true" className="h-4 w-4" />
          <p className="text-title-lg font-medium text-text">Verena</p>
        </div>
        <label className="composer-surface flex h-10 items-center gap-2 rounded-pill px-3">
          <Icon name="search" className="h-4 w-4 text-textMuted" />
          <input
            type="search"
            placeholder="Search"
            className="w-full bg-transparent text-body-md text-text outline-none placeholder:text-textMuted"
            aria-label="Search navigation"
          />
        </label>
      </div>

      <Button className="w-full justify-start" variant="secondary" onClick={onNavigate}>
        <Icon name="plus" className="h-4 w-4" />
        New session
      </Button>

      <div className="space-y-1">
        <NavItem to="/" label="Home" icon="spark" onNavigate={onNavigate} />
        <NavItem to="/activities" label="Activities" icon="activities" onNavigate={onNavigate} />
        <NavItem to="/artifacts" label="Artifacts" icon="artifacts" onNavigate={onNavigate} />
        <NavItem to="/settings" label="Settings" icon="settings" onNavigate={onNavigate} />
      </div>

      <section className="min-h-0 flex-1 overflow-hidden" aria-labelledby="left-nav-recent">
        <h2 id="left-nav-recent" className="mb-2 px-3 text-label-md font-medium tracking-wide text-textMuted">
          Recents
        </h2>
        <ul className="scroll-area max-h-full divide-y divide-[color:var(--surface-border)] overflow-y-auto pr-1">
          {activities.map((activity) => (
            <li key={activity.id} className="py-1">
              <Link
                to={`/activities/${activity.id}`}
                onClick={onNavigate}
                className="block rounded-xl px-3 py-2 text-body-md text-textMuted transition hover:bg-surfaceContainer hover:text-text focus-brand"
              >
                <p className="truncate text-body-md font-medium text-text">{activity.title}</p>
                <p className="truncate text-label-md">{activity.updatedAt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-auto flex items-center gap-2 rounded-xl px-2.5 py-2 transition-colors hover:bg-surfaceContainer">
        <Avatar name="Jane Doe" size="sm" />
        <div>
          <p className="text-body-md font-medium text-text">Jane Doe</p>
          <p className="text-label-md text-textMuted">JaneTech, Inc.</p>
        </div>
      </div>
    </nav>
  )
}
