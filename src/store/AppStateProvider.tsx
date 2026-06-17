import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  fetchRegProfileStatus,
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

  // Open a chat turn, streaming assistant tokens into pending messages. The
  // payload may carry a user `message`, a `workflow_kickoff` flag, or both.
  const streamAssistantTurn = useCallback(
    (activityId: string, payload: Record<string, unknown>) => {
      if (!accessToken) {
        return
      }
      const now = new Date()
      const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
        socket.send(JSON.stringify(payload))
      })
    },
    [accessToken, appendPending, setTasks],
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

      streamAssistantTurn(activityId, {
        message: content,
        ...(options?.modelName ? { model_name: options.modelName } : {}),
        ...(options?.workflowName ? { workflow_name: options.workflowName } : {}),
      })
    },
    [appendPending, streamAssistantTurn],
  )

  // When a regprofile run becomes ready for clarifications, ask the assistant to
  // open the conversational Q&A itself (no user message required).
  const kickoffClarification = useCallback(
    (activityId: string) => {
      streamAssistantTurn(activityId, { workflow_kickoff: true })
    },
    [streamAssistantTurn],
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

  // The Temporal workflow advances asynchronously (scrape -> generate questions ->
  // wait for answers -> synthesize). The backend only queries Temporal when the
  // status endpoint is hit, so we poll it for any in-flight run. This is what
  // surfaces the clarification questions (status -> "waiting_for_answers") and the
  // final profile (status -> "completed") in the UI. The chat websocket is only
  // open during message streaming, so it can't be relied on for these updates.
  const tasksRef = useRef(tasks)
  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  // Executions we've already opened the conversational Q&A for, so the assistant
  // asks its first question exactly once per run — persisted so a page reload
  // doesn't re-ask (the question is already in the loaded chat history).
  const kickedOffRef = useRef<Set<string>>(loadKickedOff())

  // Keep polling through "waiting_for_answers" too: after the user answers in the
  // chat, the backend signals Temporal and the run resumes, and polling is how the
  // UI learns it moved on to synthesis and then completion.
  const isPollableStatus = (status: BackgroundTask['status']) =>
    status === 'running' || status === 'queued' || status === 'waiting_for_answers'

  const hasActiveTasks = useMemo(
    () => tasks.some((task) => Boolean(task.executionId) && isPollableStatus(task.status)),
    [tasks],
  )

  useEffect(() => {
    if (!accessToken || !hasActiveTasks) {
      return
    }
    let cancelled = false
    const poll = async () => {
      const active = tasksRef.current.filter(
        (task) => Boolean(task.executionId) && isPollableStatus(task.status),
      )
      const results = await Promise.allSettled(
        active.map((task) => fetchRegProfileStatus(request, task.executionId as string)),
      )
      if (cancelled) {
        return
      }
      let anyCompleted = false
      const terminalActivityIds = new Set<string>()
      for (const result of results) {
        if (result.status !== 'fulfilled') {
          continue
        }
        const task = result.value
        if (task.status === 'completed') {
          anyCompleted = true
        }
        if (task.status === 'completed' || task.status === 'failed') {
          // The backend posts an outcome message into the conversation when a run
          // finishes; refresh that thread so it shows up in the chat.
          terminalActivityIds.add(task.activityId)
        }
        setTasks((current) => upsertById(current, task))
        // First time a run is ready for clarifications, let the assistant open
        // the conversational Q&A in the chat thread.
        if (
          task.status === 'waiting_for_answers' &&
          task.executionId &&
          !kickedOffRef.current.has(task.executionId)
        ) {
          kickedOffRef.current.add(task.executionId)
          persistKickedOff(kickedOffRef.current)
          kickoffClarification(task.activityId)
        }
      }
      if (anyCompleted) {
        // A finished run produces a regulatory-profile artifact; refresh the list.
        queryClient.invalidateQueries({ queryKey: queryKeys.artifacts })
      }
      terminalActivityIds.forEach((id) => {
        // Drop in-session optimistic/streamed messages for this thread and refetch
        // the canonical server history (which now includes the outcome message),
        // so nothing is shown twice.
        setPendingMessages((current) => {
          if (!(id in current)) {
            return current
          }
          const next = { ...current }
          delete next[id]
          return next
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.messages(id) })
      })
    }
    const interval = window.setInterval(poll, 2500)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [
    accessToken,
    hasActiveTasks,
    request,
    setTasks,
    queryClient,
    kickoffClarification,
    setPendingMessages,
  ])

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

const KICKED_OFF_STORAGE_KEY = 'vchat.kicked_off_executions'

const loadKickedOff = (): Set<string> => {
  try {
    const raw = localStorage.getItem(KICKED_OFF_STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return new Set(Array.isArray(parsed) ? parsed.map(String) : [])
  } catch {
    return new Set()
  }
}

const persistKickedOff = (ids: Set<string>) => {
  try {
    localStorage.setItem(KICKED_OFF_STORAGE_KEY, JSON.stringify([...ids]))
  } catch {
    // Best-effort; a missing localStorage just means we may re-ask on reload.
  }
}

export function useAppState() {
  const context = useContext(AppStateContext)

  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider')
  }

  return context
}
