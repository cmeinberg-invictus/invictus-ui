import { useParams } from 'react-router-dom'
import { ButtonLink } from '../components/ui/ButtonLink'
import { EmptyState } from '../components/ui/EmptyState'
import { Panel } from '../components/ui/Panel'
import { useAppState } from '../store/AppStateProvider'

export function ArtifactDetailPage() {
  const { artifactId } = useParams()
  const { artifacts } = useAppState()

  const artifact = artifacts.find((item) => item.id === artifactId)
  if (!artifact) {
    return (
      <EmptyState
        title="Artifact not found"
        description="The requested artifact is unavailable."
      />
    )
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="type-headline text-headline-sm font-medium text-text">{artifact.title}</h1>
          <p className="text-body-md text-textMuted">
            {artifact.type} - Updated {artifact.updatedAt}
          </p>
        </div>
        <ButtonLink
          to="/artifacts"
          variant="tonal"
          size="sm"
        >
          Back to artifacts
        </ButtonLink>
      </header>
      <Panel className="p-4">
        <p className="text-sm text-textMuted">
          This is a placeholder artifact view for the initial scaffold. In a production flow this
          page would render the full artifact content and revision history.
        </p>
      </Panel>
    </div>
  )
}
