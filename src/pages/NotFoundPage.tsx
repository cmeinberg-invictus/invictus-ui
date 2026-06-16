import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <EmptyState
        title="Page not found"
        description="The page you requested does not exist or is no longer available."
      />
      <Link
        to="/"
        className="inline-flex rounded-md border border-border px-3 py-2 text-sm font-medium text-text hover:bg-surfaceAlt"
      >
        Go to Home
      </Link>
    </div>
  )
}
