import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { activities, artifacts, initialBackgroundTasks, initialMessages } from '../data/mock'
import {
  fetchActivities,
  fetchArtifacts,
  fetchMessages,
  fetchTasks,
  isVchatApiEnabled,
  openChatSocket,
  startRegProfileWorkflow,
  submitRegProfileAnswers,
} from '../lib/vchatApi'
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
  startRegProfile: (activityId: string, websiteUrl: string) => Promise<void>
  submitRegProfileAnswers: (executionId: string, answers: Record<string, string>) => Promise<void>
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
  const [activityList, setActivityList] = useState<Activity[]>(activities)
  const [artifactList, setArtifactList] = useState<Artifact[]>(artifacts)
  const [tasks, setTasks] = useState<BackgroundTask[]>(initialBackgroundTasks)
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [messagesByActivity, setMessagesByActivity] = useState<Record<string, Message[]>>(
    groupMessagesByActivity(initialMessages),
  )

  useEffect(() => {
    if (!isVchatApiEnabled) {
      return
    }

    let cancelled = false
    Promise.all([fetchActivities(), fetchTasks(), fetchArtifacts()])
      .then(([nextActivities, nextTasks, nextArtifacts]) => {
        if (cancelled) {
          return
        }
        setActivityList(nextActivities)
        setTasks(nextTasks)
        setArtifactList(nextArtifacts)
      })
      .catch(() => {
        // Keep the mock scaffold usable when the backend is unavailable.
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isVchatApiEnabled || !selectedActivityId) {
      return
    }

    let cancelled = false
    fetchMessages(selectedActivityId)
      .then((messages) => {
        if (cancelled) {
          return
        }
        setMessagesByActivity((current) => ({
          ...current,
          [selectedActivityId]: messages,
        }))
      })
      .catch(() => {
        // Preserve existing local state if the backend fetch fails.
      })

    return () => {
      cancelled = true
    }
  }, [selectedActivityId])

  const getMessagesByActivity = useCallback(
    (activityId: string) => messagesByActivity[activityId] ?? [],
    [messagesByActivity],
  )

  const getArtifactsByActivity = useCallback(
    (activityId: string | null) =>
      activityId
        ? artifactList.filter((artifact) => artifact.activityId === activityId)
        : artifactList,
    [artifactList],
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

    setMessagesByActivity((current) => {
      const previous = current[activityId] ?? []
      return {
        ...current,
        [activityId]: [...previous, userMessage],
      }
    })

    if (!isVchatApiEnabled) {
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
          [activityId]: [...previous, assistantMessage],
        }
      })
      return
    }

    const assistantMessageId = `${now.getTime()}-stream`
    const socket = openChatSocket(activityId, {
      onToken: (token) => {
        setMessagesByActivity((current) => {
          const previous = current[activityId] ?? []
          const existing = previous.find((message) => message.id === assistantMessageId)
          if (!existing) {
            return {
              ...current,
              [activityId]: [
                ...previous,
                {
                  id: assistantMessageId,
                  activityId,
                  role: 'assistant',
                  content: token,
                  timestamp,
                },
              ],
            }
          }
          return {
            ...current,
            [activityId]: previous.map((message) =>
              message.id === assistantMessageId
                ? { ...message, content: `${message.content}${token}` }
                : message,
            ),
          }
        })
      },
      onDone: (message) => {
        setMessagesByActivity((current) => {
          const previous = current[activityId] ?? []
          const withoutStream = previous.filter((item) => item.id !== assistantMessageId)
          return {
            ...current,
            [activityId]: [...withoutStream, message],
          }
        })
        socket.close()
      },
      onTask: (task) => {
        setTasks((current) => upsertById(current, task))
      },
      onError: (error) => {
        setMessagesByActivity((current) => {
          const previous = current[activityId] ?? []
          return {
            ...current,
            [activityId]: [
              ...previous,
              {
                id: `${Date.now()}-error`,
                activityId,
                role: 'system',
                content: error,
                timestamp,
              },
            ],
          }
        })
      },
    })
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ message: content }))
    })
  }, [])

  const startRegProfile = useCallback(async (activityId: string, websiteUrl: string) => {
    if (!isVchatApiEnabled) {
      const now = new Date()
      setTasks((current) =>
        upsertById(current, {
          id: `${now.getTime()}-regprofile`,
          activityId,
          title: 'Regulatory profile',
          status: 'running',
          subtitle: websiteUrl,
          updatedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }),
      )
      return
    }
    const task = await startRegProfileWorkflow(activityId, websiteUrl)
    setTasks((current) => upsertById(current, task))
  }, [])

  const submitAnswers = useCallback(
    async (executionId: string, answers: Record<string, string>) => {
      if (!isVchatApiEnabled) {
        setTasks((current) =>
          current.map((task) =>
            task.executionId === executionId ? { ...task, status: 'running', questions: [] } : task,
          ),
        )
        return
      }
      const task = await submitRegProfileAnswers(executionId, answers)
      setTasks((current) => upsertById(current, task))
    },
    [],
  )

  const clearCompletedTasks = useCallback(() => {
    setTasks((current) => current.filter((task) => task.status !== 'completed'))
  }, [])

  const value = useMemo<AppStateContextValue>(
    () => ({
      activities: activityList,
      artifacts: artifactList,
      tasks,
      selectedActivityId,
      setSelectedActivityId,
      getMessagesByActivity,
      getArtifactsByActivity,
      sendMessage,
      startRegProfile,
      submitRegProfileAnswers: submitAnswers,
      clearCompletedTasks,
    }),
    [
      activityList,
      artifactList,
      tasks,
      selectedActivityId,
      getMessagesByActivity,
      getArtifactsByActivity,
      sendMessage,
      startRegProfile,
      submitAnswers,
      clearCompletedTasks,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

const upsertById = <T extends { id: string }>(items: T[], nextItem: T) => {
  const exists = items.some((item) => item.id === nextItem.id)
  if (!exists) {
    return [nextItem, ...items]
  }
  return items.map((item) => (item.id === nextItem.id ? nextItem : item))
}

export function useAppState() {
  const context = useContext(AppStateContext)

  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider')
  }

  return context
}
