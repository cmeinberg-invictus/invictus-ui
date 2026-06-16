import { Link } from 'react-router-dom'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { IconButton } from '../../components/ui/IconButton'
import { NavItem } from '../../components/ui/NavItem'
import verenaLogoSymbol from '../../assets/verena-logo-symbol.svg'
import { cn } from '../../lib/cn'
import { useAppState } from '../../store/AppStateProvider'

type LeftNavProps = {
  isCollapsed?: boolean
  onToggleCollapsed?: () => void
  onNavigate?: () => void
}

export function LeftNav({ isCollapsed = false, onToggleCollapsed, onNavigate }: LeftNavProps) {
  const { activities } = useAppState()

  return (
    <nav
      id="primary-navigation"
      className={cn(
        'left-nav flex h-full min-h-0 flex-col gap-6 overflow-hidden bg-transparent p-4',
        isCollapsed && 'is-collapsed items-center gap-4 p-3',
      )}
      aria-label="Primary"
    >
      <div className={cn('w-full shrink-0 space-y-3', isCollapsed && 'space-y-0')}>
        <div className={cn('flex items-center gap-2', isCollapsed ? 'flex-col' : 'justify-between')}>
          <div className="flex min-w-0 items-center gap-2">
            <img src={verenaLogoSymbol} alt="" aria-hidden="true" className="h-4 w-4 shrink-0" />
            <p
              className={cn('left-nav-label type-title text-title-lg font-medium text-text', isCollapsed && 'is-hidden')}
              aria-hidden={isCollapsed}
            >
              Verena
            </p>
          </div>

          {onToggleCollapsed ? (
            <IconButton
              variant="ghost"
              size="sm"
              onClick={onToggleCollapsed}
              aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
              aria-controls="primary-navigation"
              aria-expanded={!isCollapsed}
              title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              <Icon
                name="chevronRight"
                className={cn('left-nav-toggle-icon h-4 w-4', !isCollapsed && 'rotate-180')}
              />
            </IconButton>
          ) : null}
        </div>
        {!isCollapsed ? (
          <label className="composer-surface flex h-10 items-center gap-2 rounded-pill px-3">
            <Icon name="search" className="h-4 w-4 text-textMuted" />
            <input
              type="search"
              placeholder="Search"
              className="w-full bg-transparent text-body-md text-text outline-none placeholder:text-textMuted"
              aria-label="Search navigation"
            />
          </label>
        ) : null}
      </div>

      <Button
        className={cn('shrink-0', isCollapsed ? 'h-11 w-11 px-0' : 'w-full justify-start')}
        variant="secondary"
        onClick={onNavigate}
        aria-label={isCollapsed ? 'New session' : undefined}
        title={isCollapsed ? 'New session' : undefined}
      >
        <Icon name="plus" className="h-4 w-4" />
        {!isCollapsed ? <span className="left-nav-label">New session</span> : null}
      </Button>

      <div className={cn('shrink-0 space-y-1', isCollapsed && 'flex flex-col items-center')}>
        <NavItem to="/" label="Home" icon="spark" isCollapsed={isCollapsed} onNavigate={onNavigate} />
        <NavItem
          to="/activities"
          label="Activities"
          icon="activities"
          isCollapsed={isCollapsed}
          onNavigate={onNavigate}
        />
        <NavItem
          to="/artifacts"
          label="Artifacts"
          icon="artifacts"
          isCollapsed={isCollapsed}
          onNavigate={onNavigate}
        />
        <NavItem
          to="/settings"
          label="Settings"
          icon="settings"
          isCollapsed={isCollapsed}
          onNavigate={onNavigate}
        />
      </div>

      {!isCollapsed ? (
        <section className="min-h-0 flex-1 overflow-hidden" aria-labelledby="left-nav-recent">
          <h2 id="left-nav-recent" className="type-label mb-2 px-3 text-label-md font-medium text-textMuted">
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
      ) : (
        <div className="min-h-0 flex-1" aria-hidden="true" />
      )}

      <div
        className={cn(
          'mt-auto flex shrink-0 items-center gap-2 rounded-xl px-2.5 py-2 transition-colors hover:bg-surfaceContainer',
          isCollapsed && 'justify-center px-1',
        )}
        title={isCollapsed ? 'Jane Doe, JaneTech, Inc.' : undefined}
      >
        <Avatar name="Jane Doe" size="sm" />
        {isCollapsed ? <span className="sr-only">Signed in as Jane Doe, JaneTech, Inc.</span> : null}
        <div className={cn('left-nav-label', isCollapsed && 'is-hidden')} aria-hidden={isCollapsed}>
          <p className="text-body-md font-medium text-text">Jane Doe</p>
          <p className="text-label-md text-textMuted">JaneTech, Inc.</p>
        </div>
      </div>
    </nav>
  )
}
