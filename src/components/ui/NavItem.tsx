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
  onNavigate?: () => void
}

export function NavItem({ to, label, icon, onNavigate }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'state-layer flex h-11 items-center gap-2 rounded-pill px-4 text-sm font-medium transition focus-brand',
          isActive
            ? 'bg-surfaceContainerHighest text-text shadow-e1'
            : 'text-textMuted hover:bg-surfaceContainer hover:text-text',
        )
      }
    >
      {icon ? <Icon name={icon} className="h-4 w-4 shrink-0" /> : null}
      {label}
    </NavLink>
  )
}
