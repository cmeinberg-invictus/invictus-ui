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
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-text">Artifacts</h1>
        <p className="text-sm text-textMuted">Documents and outputs generated from activities.</p>
      </header>
      <ul className="space-y-3">
        {artifacts.map((artifact) => (
          <li key={artifact.id}>
            <Panel className="p-4">
              <Link to={`/artifacts/${artifact.id}`} className="block rounded focus-visible:outline-none">
                <p className="text-sm font-semibold text-text">{artifact.title}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-textMuted">{artifact.type}</p>
                <p className="mt-2 text-xs text-textMuted">Updated {artifact.updatedAt}</p>
              </Link>
            </Panel>
          </li>
        ))}
      </ul>
    </div>
  )
}
