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
          'flex h-11 items-center gap-2 rounded-pill px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          isActive
            ? 'chat-glass-input text-text shadow-glass'
            : 'text-textMuted hover:bg-surfaceAlt/85 hover:text-text',
        )
      }
    >
      {icon ? <Icon name={icon} className="h-4 w-4 shrink-0" /> : null}
      {label}
    </NavLink>
  )
}
