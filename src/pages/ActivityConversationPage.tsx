import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ButtonLink } from '../components/ui/ButtonLink'
import { EmptyState } from '../components/ui/EmptyState'
import { ChatView } from '../features/chat/ChatView'
import { useAppState } from '../store/AppStateProvider'

export function ActivityConversationPage() {
  const { activityId } = useParams()
  const { activities, setSelectedActivityId } = useAppState()

  useEffect(() => {
    setSelectedActivityId(activityId ?? null)
    return () => {
      setSelectedActivityId(null)
    }
  }, [activityId, setSelectedActivityId])

  if (!activityId) {
    return (
      <EmptyState
        title="Select an activity"
        description="Choose an activity from the left menu to open its conversation."
      />
    )
  }

  const activity = activities.find((item) => item.id === activityId)
  if (!activity) {
    return (
      <EmptyState
        title="Activity not found"
        description="That activity does not exist. Return to the activities list."
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <header className="flex shrink-0 items-center justify-between">
        <div>
          <h1 className="type-headline text-headline-sm font-medium text-text">{activity.title}</h1>
          <p className="text-body-md text-textMuted">{activity.excerpt}</p>
        </div>
        <ButtonLink
          to="/activities"
          variant="tonal"
          size="sm"
        >
          All activities
        </ButtonLink>
      </header>
      <ChatView activityId={activity.id} />
    </div>
  )
}
