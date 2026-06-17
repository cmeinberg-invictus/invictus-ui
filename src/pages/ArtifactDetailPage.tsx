import { useParams } from 'react-router-dom'
import { ButtonLink } from '../components/ui/ButtonLink'
import { EmptyState } from '../components/ui/EmptyState'
import { Markdown } from '../components/ui/Markdown'
import { Panel } from '../components/ui/Panel'
import { useAppState } from '../store/AppStateProvider'

export function ArtifactDetailPage() {
  const { artifactId } = useParams()
  const { artifacts } = useAppState()

  const artifact = artifacts.find((item) => item.id === artifactId)
  if (!artifact) {
    return (
      <EmptyState title="Artifact not found" description="The requested artifact is unavailable." />
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
        <ButtonLink to="/artifacts" variant="tonal" size="sm">
          Back to artifacts
        </ButtonLink>
      </header>
      <Panel className="p-4">
        {artifact.content ? (
          <Markdown content={artifact.content} />
        ) : (
          <p className="text-sm text-textMuted">
            This artifact does not have content yet. Generated workflow outputs will appear here.
          </p>
        )}
      </Panel>
    </div>
  )
}
