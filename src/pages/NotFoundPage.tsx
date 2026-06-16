import { ButtonLink } from '../components/ui/ButtonLink'
import { EmptyState } from '../components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <EmptyState
        title="Page not found"
        description="The page you requested does not exist or is no longer available."
      />
      <ButtonLink
        to="/"
        variant="tonal"
        size="md"
      >
        Go to Home
      </ButtonLink>
    </div>
  )
}
