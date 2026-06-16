import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

type NavItemProps = {
  to: string
  label: string
  icon?:
    | 'activities'
    | 'artifacts'
    | 'wallet'
    | 'contacts'
    | 'connectors'
    | 'settings'
    | 'spark'
  isCollapsed?: boolean
  onNavigate?: () => void
}

export function NavItem({ to, label, icon, isCollapsed = false, onNavigate }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      aria-label={isCollapsed ? label : undefined}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'state-layer flex h-11 items-center gap-2 rounded-pill text-sm font-medium transition-[background-color,color,box-shadow,width,padding,gap] duration-150 ease-out focus-brand',
          isCollapsed ? 'w-11 justify-center px-0' : 'px-4',
          isActive
            ? 'bg-surfaceContainerHigh text-text'
            : 'text-textMuted hover:bg-surfaceContainer hover:text-text',
        )
      }
    >
      {icon ? <Icon name={icon} className="h-4 w-4 shrink-0" /> : null}
      <span className={cn('left-nav-label truncate', isCollapsed && 'is-hidden')} aria-hidden={isCollapsed}>
        {label}
      </span>
    </NavLink>
  )
}
