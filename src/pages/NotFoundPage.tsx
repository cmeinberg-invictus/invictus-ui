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
        className="state-layer focus-brand inline-flex rounded-pill bg-secondaryContainer px-4 py-2 text-sm font-medium text-onSecondaryContainer shadow-e1"
      >
        Go to Home
      </Link>
    </div>
  )
}
