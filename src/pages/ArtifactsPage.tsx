import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { Panel } from '../components/ui/Panel'
import { useAppState } from '../store/AppStateProvider'

export function ArtifactsPage() {
  const { artifacts } = useAppState()

  if (!artifacts.length) {
    return (
      <EmptyState
        title="No artifacts available"
        description="Artifacts produced by activities will appear here."
      />
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-headline-sm font-medium text-text">Artifacts</h1>
        <p className="text-body-md text-textMuted">Documents and outputs generated from activities.</p>
      </header>

      <Panel className="overflow-hidden">
        <ul className="divide-y divide-[color:var(--surface-border)]">
          {artifacts.map((artifact) => (
            <li key={artifact.id}>
              <Link
                to={`/artifacts/${artifact.id}`}
                className="focus-brand block px-5 py-4 transition-colors hover:bg-surfaceContainerHigh/50"
              >
                <p className="text-body-md font-medium text-text">{artifact.title}</p>
                <p className="mt-1 text-label-md font-medium tracking-wide text-textMuted">{artifact.type}</p>
                <p className="mt-2 text-label-md text-textMuted">Updated {artifact.updatedAt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
