import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Icon } from '../../components/ui/Icon'
import { IconButton } from '../../components/ui/IconButton'
import { Panel } from '../../components/ui/Panel'
import { BackgroundTasks } from '../../features/tasks/BackgroundTasks'
import { cn } from '../../lib/cn'
import { useAppState } from '../../store/AppStateProvider'
import type { Artifact } from '../../types/domain'

type RightPanelProps = {
  activityId: string | null
  onClose: () => void
}

type ContextGroupId = 'backgroundTasks' | 'artifacts' | 'workflow'

type ContextPanelGroupProps = {
  id: ContextGroupId
  title: string
  description: string
  open: boolean
  onToggle: (id: ContextGroupId) => void
  children: ReactNode
}

const artifactTileClasses: Record<Artifact['type'], string> = {
  notes: 'bg-primaryContainer text-onPrimaryContainer',
  checklist: 'bg-successContainer text-onSuccessContainer',
  spec: 'bg-secondaryContainer text-onSecondaryContainer',
  regulatory_profile: 'bg-secondaryContainer text-onSecondaryContainer',
}

function ContextPanelGroup({
  id,
  title,
  description,
  open,
  onToggle,
  children,
}: ContextPanelGroupProps) {
  const titleId = `${id}-title`
  const panelId = `${id}-panel`

  return (
    <section aria-labelledby={titleId}>
      <Panel className="overflow-hidden rounded-[var(--radius-xl)] border-[color:var(--surface-border-strong)] bg-[color:var(--context-group-background)] shadow-e3">
        <h2 id={titleId}>
          <button
            type="button"
            className="focus-brand flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-[color:var(--context-group-background-hover)]"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => onToggle(id)}
          >
            <span className="min-w-0">
              <span className="type-title block text-title-sm font-medium text-text">{title}</span>
              <span className="block truncate text-label-md text-textMuted">{description}</span>
            </span>
            <Icon
              name="chevronDown"
              className={cn(
                'h-4 w-4 shrink-0 text-textMuted transition-transform duration-150',
                open && 'rotate-180',
              )}
            />
          </button>
        </h2>
        <div
          id={panelId}
          aria-hidden={!open}
          inert={!open ? true : undefined}
          className={cn(
            'grid border-t border-[color:var(--surface-border)] transition-[grid-template-rows,opacity] duration-200 ease-out',
            open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="p-3">{children}</div>
          </div>
        </div>
      </Panel>
    </section>
  )
}

export function RightPanel({ activityId, onClose }: RightPanelProps) {
  const { getArtifactsByActivity } = useAppState()
  const contextualArtifacts = getArtifactsByActivity(activityId)
  const [openGroups, setOpenGroups] = useState<Record<ContextGroupId, boolean>>({
    backgroundTasks: true,
    artifacts: true,
    workflow: true,
  })

  const toggleGroup = (groupId: ContextGroupId) => {
    setOpenGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }))
  }

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden bg-transparent p-4">
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <div>
          <h2 className="type-title text-title-sm font-medium text-text">Context panel</h2>
          <p className="text-label-md text-textMuted">Artifacts and workflow cards</p>
        </div>
        <IconButton variant="ghost" size="md" onClick={onClose} aria-label="Hide context panel">
          <Icon name="close" className="h-4 w-4" />
        </IconButton>
      </div>

      <div className="scroll-area min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        <ContextPanelGroup
          id="backgroundTasks"
          title="Background tasks"
          description="Running jobs and recent updates"
          open={openGroups.backgroundTasks}
          onToggle={toggleGroup}
        >
          <BackgroundTasks activityId={activityId} variant="embedded" />
        </ContextPanelGroup>

        <ContextPanelGroup
          id="artifacts"
          title="Artifacts"
          description={`${contextualArtifacts.length} workflow reference${
            contextualArtifacts.length === 1 ? '' : 's'
          }`}
          open={openGroups.artifacts}
          onToggle={toggleGroup}
        >
          <ul className="space-y-1">
            {contextualArtifacts.map((artifact) => (
              <li key={artifact.id}>
                <Link
                  to={`/artifacts/${artifact.id}`}
                  className="focus-brand group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-[color:var(--context-group-background-hover)]"
                >
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-e1',
                      artifactTileClasses[artifact.type],
                    )}
                  >
                    <Icon name="artifacts" className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-body-md font-medium text-text">{artifact.title}</p>
                    <p className="text-label-md text-textMuted">
                      {artifact.type} - Updated {artifact.updatedAt}
                    </p>
                  </span>
                  <Icon
                    name="chevronRight"
                    className="h-4 w-4 shrink-0 text-textMuted transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </ContextPanelGroup>

        <ContextPanelGroup
          id="workflow"
          title="Workflow"
          description="Recommended next actions"
          open={openGroups.workflow}
          onToggle={toggleGroup}
        >
          <div className="space-y-2">
            <Card variant="reasoning" className="space-y-2 p-3">
              <p className="type-label text-label-md font-medium">Multi actions</p>
              <p className="text-body-md font-medium">
                Background sync and evidence extraction running.
              </p>
              <div className="flex items-center gap-2 text-label-md">
                <Icon name="clock" className="h-3.5 w-3.5" />
                Updated moments ago
              </div>
            </Card>
            <Card variant="followUp" className="space-y-1 p-3">
              <p className="type-label text-label-md font-medium">Follow up</p>
              <p className="text-body-md">Review SAFE agreement excerpts before final reply.</p>
            </Card>
          </div>
        </ContextPanelGroup>
      </div>
    </aside>
  )
}
