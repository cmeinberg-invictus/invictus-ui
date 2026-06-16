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
    <nav
      className="flex h-full flex-col gap-5 bg-[radial-gradient(circle_at_top,rgba(125,53,233,0.15),transparent_45%),var(--color-bg)] p-4"
      aria-label="Primary"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <img src={verenaLogoSymbol} alt="" aria-hidden="true" className="h-4 w-4" />
          <p className="font-heading text-xl font-semibold leading-7 tracking-[0.03px] text-text">Verena</p>
        </div>
        <label className="chat-glass-input flex h-10 items-center gap-2 rounded-pill px-3">
          <Icon name="search" className="h-4 w-4 text-textMuted" />
          <input
            type="search"
            placeholder="Search"
            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-textMuted"
            aria-label="Search navigation"
          />
        </label>
      </div>

      <Button className="w-full justify-start" variant="glass" onClick={onNavigate}>
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
        <h2 id="left-nav-recent" className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-textMuted">
          Recents
        </h2>
        <ul className="scroll-area max-h-full space-y-1 overflow-y-auto pr-1">
          {activities.map((activity) => (
            <li key={activity.id}>
              <Link
                to={`/activities/${activity.id}`}
                onClick={onNavigate}
                className="block rounded-xl px-3 py-2 text-sm text-textMuted transition hover:bg-surfaceAlt/90 hover:text-text"
              >
                <p className="truncate font-medium text-text">{activity.title}</p>
                <p className="truncate text-xs">{activity.updatedAt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="chat-glass-input mt-auto flex items-center gap-2 rounded-xl p-2.5">
        <Avatar name="Jane Doe" size="sm" />
        <div>
          <p className="text-sm font-semibold text-text">Jane Doe</p>
          <p className="text-xs text-textMuted">JaneTech, Inc.</p>
        </div>
      </div>
    </nav>
  )
}
