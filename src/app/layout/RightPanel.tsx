import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Icon } from '../../components/ui/Icon'
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
    <aside className="flex h-full flex-col bg-transparent p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-text">Context panel</h2>
          <p className="text-xs text-textMuted">Artifacts and workflow cards</p>
        </div>
        <IconButton variant="default" size="lg" onClick={onClose} aria-label="Hide context panel">
          <Icon name="close" className="h-4 w-4" />
        </IconButton>
      </div>

      <div className="scroll-area space-y-6 overflow-y-auto pr-1">
        <BackgroundTasks activityId={activityId} />

        <section aria-labelledby="artifact-title" className="space-y-2">
          <h2 id="artifact-title" className="text-sm font-semibold text-text">
            Artifacts
          </h2>
          <ul className="space-y-2">
            {contextualArtifacts.map((artifact) => (
              <li key={artifact.id}>
                <Link
                  to={`/artifacts/${artifact.id}`}
                  className="block rounded-xl focus-brand"
                >
                  <Card variant="snippet" className="space-y-2 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-wide text-textMuted">{artifact.type}</p>
                      <Icon name="chevronRight" className="h-4 w-4 text-textMuted" />
                    </div>
                    <p className="text-sm font-semibold text-text">{artifact.title}</p>
                    <p className="text-xs text-textMuted">{artifact.updatedAt}</p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="workflow-title" className="space-y-2">
          <h2 id="workflow-title" className="text-sm font-semibold text-text">
            Workflow
          </h2>
          <Card variant="reasoning" className="space-y-2 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide">Multi actions</p>
            <p className="text-sm font-semibold">Background sync and evidence extraction running.</p>
            <div className="flex items-center gap-2 text-xs">
              <Icon name="clock" className="h-3.5 w-3.5" />
              Updated moments ago
            </div>
          </Card>
          <Card variant="followUp" className="space-y-1 p-3">
            <p className="text-xs uppercase tracking-wide">Follow up</p>
            <p className="text-sm">Review SAFE agreement excerpts before final reply.</p>
          </Card>
        </section>
      </div>
    </aside>
  )
}
