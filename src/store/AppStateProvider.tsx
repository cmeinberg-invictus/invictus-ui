import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../lib/auth'
import {
  queryKeys,
  useActivities,
  useArtifacts,
  useMe,
  useMessages,
  useTasks,
} from '../lib/queries'
import {
  createConversation,
  openChatSocket,
  startRegProfileWorkflow,
  submitRegProfileAnswers as submitRegProfileAnswersApi,
} from '../lib/vchatApi'
import type { Activity, Artifact, BackgroundTask, CurrentUser, Message } from '../types/domain'

type AppStateContextValue = {
  activities: Activity[]
  artifacts: Artifact[]
  tasks: BackgroundTask[]
  currentUser: CurrentUser | null
  isLoading: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedActivityId: string | null
  setSelectedActivityId: (activityId: string | null) => void
  getMessagesByActivity: (activityId: string) => Message[]
  getArtifactsByActivity: (activityId: string | null) => Artifact[]
  createActivity: (title?: string) => Promise<Activity>
  sendMessage: (activityId: string, content: string, options?: SendMessageOptions) => void
  startRegProfile: (activityId: string, websiteUrl: string) => Promise<void>
  submitRegProfileAnswers: (executionId: string, answers: Record<string, string>) => Promise<void>
  clearCompletedTasks: () => void
}

type SendMessageOptions = {
  modelName?: string
  workflowName?: string
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined)

type AppStateProviderProps = {
  children: ReactNode
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const { request, accessToken } = useAuth()
  const queryClient = useQueryClient()

  const activitiesQuery = useActivities()
  const artifactsQuery = useArtifacts()
  const tasksQuery = useTasks()
  const meQuery = useMe()

  const [selectedActivityId, setSelectedActivityIdState] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Client-side messages for the active conversation: optimistic user input,
  // streamed assistant tokens, and inline errors. Server history comes from the
  // React Query cache and is merged in `getMessagesByActivity`.
  const [pendingMessages, setPendingMessages] = useState<Record<string, Message[]>>({})

  const messagesQuery = useMessages(selectedActivityId)

  const activities = useMemo(() => activitiesQuery.data ?? [], [activitiesQuery.data])
  const artifacts = useMemo(() => artifactsQuery.data ?? [], [artifactsQuery.data])
  const tasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data])
  const currentUser = meQuery.data ?? null
  const serverMessages = messagesQuery.data

  const setSelectedActivityId = useCallback((activityId: string | null) => {
    // Drop any in-flight client messages when switching conversations; the
    // server history reloads for the new conversation.
    setPendingMessages({})
    setSelectedActivityIdState(activityId)
  }, [])

  const setTasks = useCallback(
    (updater: (current: BackgroundTask[]) => BackgroundTask[]) => {
      queryClient.setQueryData<BackgroundTask[]>(queryKeys.tasks, (current) =>
        updater(current ?? []),
      )
    },
    [queryClient],
  )

  const appendPending = useCallback(
    (activityId: string, updater: (current: Message[]) => Message[]) => {
      setPendingMessages((current) => ({
        ...current,
        [activityId]: updater(current[activityId] ?? []),
      }))
    },
    [],
  )

  const getMessagesByActivity = useCallback(
    (activityId: string) => {
      const base = activityId === selectedActivityId ? serverMessages ?? [] : []
      const pending = pendingMessages[activityId] ?? []
      return [...base, ...pending]
    },
    [selectedActivityId, serverMessages, pendingMessages],
  )

  const getArtifactsByActivity = useCallback(
    (activityId: string | null) =>
      activityId
        ? artifacts.filter((artifact) => artifact.activityId === activityId)
        : artifacts,
    [artifacts],
  )

  const createActivity = useCallback(
    async (title?: string) => {
      const activity = await createConversation(request, {
        title: title?.trim() || 'New session',
      })
      queryClient.setQueryData<Activity[]>(queryKeys.activities, (current) => [
        activity,
        ...(current ?? []),
      ])
      return activity
    },
    [request, queryClient],
  )

  const sendMessage = useCallback(
    (activityId: string, content: string, options?: SendMessageOptions) => {
      const now = new Date()
      const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const userMessage: Message = {
        id: `${now.getTime()}-u`,
        activityId,
        role: 'user',
        content,
        timestamp,
      }

      appendPending(activityId, (previous) => [...previous, userMessage])

      if (!accessToken) {
        return
      }

      const assistantMessageId = `${now.getTime()}-stream`
      const socket = openChatSocket(activityId, accessToken, {
        onToken: (token) => {
          appendPending(activityId, (previous) => {
            const existing = previous.find((message) => message.id === assistantMessageId)
            if (!existing) {
              return [
                ...previous,
                { id: assistantMessageId, activityId, role: 'assistant', content: token, timestamp },
              ]
            }
            return previous.map((message) =>
              message.id === assistantMessageId
                ? { ...message, content: `${message.content}${token}` }
                : message,
            )
          })
        },
        onDone: (message) => {
          appendPending(activityId, (previous) => [
            ...previous.filter((item) => item.id !== assistantMessageId),
            message,
          ])
          socket.close()
        },
        onTask: (task) => {
          setTasks((current) => upsertById(current, task))
        },
        onError: (error) => {
          appendPending(activityId, (previous) => [
            ...previous,
            { id: `${Date.now()}-error`, activityId, role: 'system', content: error, timestamp },
          ])
        },
      })
      socket.addEventListener('open', () => {
        socket.send(
          JSON.stringify({
            message: content,
            ...(options?.modelName ? { model_name: options.modelName } : {}),
            ...(options?.workflowName ? { workflow_name: options.workflowName } : {}),
          }),
        )
      })
    },
    [accessToken, appendPending, setTasks],
  )

  const startRegProfile = useCallback(
    async (activityId: string, websiteUrl: string) => {
      const task = await startRegProfileWorkflow(request, activityId, websiteUrl)
      setTasks((current) => upsertById(current, task))
    },
    [request, setTasks],
  )

  const submitRegProfileAnswers = useCallback(
    async (executionId: string, answers: Record<string, string>) => {
      const task = await submitRegProfileAnswersApi(request, executionId, answers)
      setTasks((current) => upsertById(current, task))
    },
    [request, setTasks],
  )

  const clearCompletedTasks = useCallback(() => {
    setTasks((current) => current.filter((task) => task.status !== 'completed'))
  }, [setTasks])

  const isLoading = activitiesQuery.isLoading || tasksQuery.isLoading || artifactsQuery.isLoading

  const value = useMemo<AppStateContextValue>(
    () => ({
      activities,
      artifacts,
      tasks,
      currentUser,
      isLoading,
      searchQuery,
      setSearchQuery,
      selectedActivityId,
      setSelectedActivityId,
      getMessagesByActivity,
      getArtifactsByActivity,
      createActivity,
      sendMessage,
      startRegProfile,
      submitRegProfileAnswers,
      clearCompletedTasks,
    }),
    [
      activities,
      artifacts,
      tasks,
      currentUser,
      isLoading,
      searchQuery,
      selectedActivityId,
      setSelectedActivityId,
      getMessagesByActivity,
      getArtifactsByActivity,
      createActivity,
      sendMessage,
      startRegProfile,
      submitRegProfileAnswers,
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
