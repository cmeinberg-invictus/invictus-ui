import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { activities, artifacts, initialBackgroundTasks, initialMessages } from '../data/mock'
import type { Activity, Artifact, BackgroundTask, Message } from '../types/domain'

type AppStateContextValue = {
  activities: Activity[]
  artifacts: Artifact[]
  tasks: BackgroundTask[]
  selectedActivityId: string | null
  setSelectedActivityId: (activityId: string | null) => void
  getMessagesByActivity: (activityId: string) => Message[]
  getArtifactsByActivity: (activityId: string | null) => Artifact[]
  sendMessage: (activityId: string, content: string) => void
  clearCompletedTasks: () => void
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined)

const groupMessagesByActivity = (messages: Message[]): Record<string, Message[]> =>
  messages.reduce<Record<string, Message[]>>((acc, message) => {
    const current = acc[message.activityId] ?? []
    current.push(message)
    acc[message.activityId] = current
    return acc
  }, {})

type AppStateProviderProps = {
  children: ReactNode
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [tasks, setTasks] = useState<BackgroundTask[]>(initialBackgroundTasks)
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [messagesByActivity, setMessagesByActivity] = useState<Record<string, Message[]>>(
    groupMessagesByActivity(initialMessages),
  )

  const getMessagesByActivity = useCallback(
    (activityId: string) => messagesByActivity[activityId] ?? [],
    [messagesByActivity],
  )

  const getArtifactsByActivity = useCallback(
    (activityId: string | null) =>
      activityId ? artifacts.filter((artifact) => artifact.activityId === activityId) : artifacts,
    [],
  )

  const sendMessage = useCallback((activityId: string, content: string) => {
    const now = new Date()
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMessage: Message = {
      id: `${now.getTime()}-u`,
      activityId,
      role: 'user',
      content,
      timestamp,
    }
    const assistantMessage: Message = {
      id: `${now.getTime()}-a`,
      activityId,
      role: 'assistant',
      content: `Received. I queued that update for activity "${activityId}".`,
      timestamp,
    }

    setMessagesByActivity((current) => {
      const previous = current[activityId] ?? []
      return {
        ...current,
        [activityId]: [...previous, userMessage, assistantMessage],
      }
    })
  }, [])

  const clearCompletedTasks = useCallback(() => {
    setTasks((current) => current.filter((task) => task.status !== 'completed'))
  }, [])

  const value = useMemo<AppStateContextValue>(
    () => ({
      activities,
      artifacts,
      tasks,
      selectedActivityId,
      setSelectedActivityId,
      getMessagesByActivity,
      getArtifactsByActivity,
      sendMessage,
      clearCompletedTasks,
    }),
    [
      tasks,
      selectedActivityId,
      getMessagesByActivity,
      getArtifactsByActivity,
      sendMessage,
      clearCompletedTasks,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)

  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider')
  }

  return context
}
