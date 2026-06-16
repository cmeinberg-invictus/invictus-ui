import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
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
    <div className="flex h-full min-h-[60vh] flex-col gap-3">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text">{activity.title}</h1>
          <p className="text-sm text-textMuted">{activity.excerpt}</p>
        </div>
        <Link
          to="/activities"
          className="rounded-md border border-border px-3 py-2 text-xs font-medium text-text hover:bg-surfaceAlt"
        >
          All activities
        </Link>
      </header>
      <ChatView activityId={activity.id} />
    </div>
  )
}
