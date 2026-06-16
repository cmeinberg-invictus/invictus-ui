import { Link } from 'react-router-dom'
import { IconButton } from '../../components/ui/IconButton'
import { BackgroundTasks } from '../../features/tasks/BackgroundTasks'
import { useAppState } from '../../store/AppStateProvider'

type RightPanelProps = {
  activityId: string | null
  onClose: () => void
}

export function RightPanel({ activityId, onClose }: RightPanelProps) {
  const { getArtifactsByActivity } = useAppState()
  const contextualArtifacts = getArtifactsByActivity(activityId)

  return (
    <aside className="flex h-full flex-col border-l border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text">Context panel</h2>
        <IconButton onClick={onClose} aria-label="Hide context panel">
          <span aria-hidden="true">×</span>
        </IconButton>
      </div>

      <div className="scroll-area space-y-6 overflow-y-auto">
        <BackgroundTasks activityId={activityId} />

        <section aria-labelledby="artifact-title" className="space-y-2">
          <h2 id="artifact-title" className="text-sm font-semibold text-text">
            Artifacts
          </h2>
          <ul className="space-y-2">
            {contextualArtifacts.map((artifact) => (
              <li key={artifact.id} className="rounded-md border border-border bg-surfaceAlt p-3">
                <Link to={`/artifacts/${artifact.id}`} className="block rounded focus-visible:outline-none">
                  <p className="text-sm font-medium text-text">{artifact.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-textMuted">
                    {artifact.type} · {artifact.updatedAt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  )
}
