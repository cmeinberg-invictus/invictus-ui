import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'

type NavItemProps = {
  to: string
  label: string
  onNavigate?: () => void
}

export function NavItem({ to, label, onNavigate }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex h-10 items-center rounded-md px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          isActive ? 'bg-surfaceAlt text-text' : 'text-textMuted hover:bg-surfaceAlt hover:text-text',
        )
      }
    >
      {label}
    </NavLink>
  )
}
