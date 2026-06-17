import type { Activity, Artifact, BackgroundTask, Message, TaskStatus } from '../types/domain'

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'
const wsBaseUrl = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws'
const authToken = import.meta.env.VITE_AUTH_TOKEN ?? ''

export const isVchatApiEnabled = Boolean(authToken)

type VchatConversation = {
  id: number
  title: string
  model_name: string
  created_at: string
  updated_at: string
}

type VchatMessage = {
  id: number
  conversation: number
  role: Message['role']
  content: string
  created_at: string
}

type VchatWorkflowExecution = {
  id: number
  conversation: number
  external_workflow_id: string
  execution_type: string
  status: TaskStatus
  website_url: string
  status_payload: {
    questions?: BackgroundTask['questions']
    error?: string | null
  }
  error: string
  updated_at: string
}

type VchatArtifact = {
  id: number
  conversation: number
  title: string
  artifact_type: Artifact['type']
  content: string
  updated_at: string
}

export type WorkflowEventPayload = {
  execution_id: number
  execution_type: string
  status: TaskStatus
  title: string
  subtitle: string
  questions?: BackgroundTask['questions']
  error?: string
  updated_at: string
}

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
      ...init.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`vchat API request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export const fetchActivities = async (): Promise<Activity[]> => {
  const conversations = await request<VchatConversation[]>('/conversations/')
  return conversations.map(toActivity)
}

export const fetchMessages = async (activityId: string): Promise<Message[]> => {
  const messages = await request<VchatMessage[]>(`/conversations/${activityId}/messages/`)
  return messages.map(toMessage)
}

export const fetchTasks = async (): Promise<BackgroundTask[]> => {
  const executions = await request<VchatWorkflowExecution[]>('/workflow-runs/')
  return executions.map(toBackgroundTask)
}

export const fetchArtifacts = async (): Promise<Artifact[]> => {
  const artifacts = await request<VchatArtifact[]>('/workflow-artifacts/')
  return artifacts.map(toArtifact)
}

export const startRegProfileWorkflow = async (
  activityId: string,
  websiteUrl: string,
): Promise<BackgroundTask> => {
  const execution = await request<VchatWorkflowExecution>('/workflow-runs/', {
    method: 'POST',
    body: JSON.stringify({
      conversation: Number(activityId),
      website_url: websiteUrl,
    }),
  })
  return toBackgroundTask(execution)
}

export const submitRegProfileAnswers = async (
  executionId: string,
  answers: Record<string, string>,
): Promise<BackgroundTask> => {
  const execution = await request<VchatWorkflowExecution>(
    `/workflow-runs/${executionId}/answers/`,
    {
      method: 'POST',
      body: JSON.stringify({ answers }),
    },
  )
  return toBackgroundTask(execution)
}

export const openChatSocket = (
  activityId: string,
  handlers: {
    onToken: (token: string) => void
    onDone: (message: Message) => void
    onTask: (task: BackgroundTask) => void
    onError: (error: string) => void
  },
) => {
  const socket = new WebSocket(
    `${wsBaseUrl}/chat/${activityId}/?token=${encodeURIComponent(authToken)}`,
  )

  socket.addEventListener('message', (event) => {
    const payload = JSON.parse(event.data)
    if (payload.type === 'token') {
      handlers.onToken(String(payload.token ?? ''))
      return
    }
    if (payload.type === 'done' && payload.message) {
      handlers.onDone(toSocketMessage(payload.message, activityId))
      return
    }
    if (payload.type === 'background_task') {
      handlers.onTask(toBackgroundTaskEvent(payload, activityId))
      return
    }
    if (payload.type === 'error') {
      handlers.onError(String(payload.error ?? 'Unknown chat error'))
    }
  })

  return socket
}

const toActivity = (conversation: VchatConversation): Activity => ({
  id: String(conversation.id),
  title: conversation.title || `Conversation ${conversation.id}`,
  excerpt: conversation.model_name ? `Model: ${conversation.model_name}` : 'Chat activity',
  updatedAt: formatDate(conversation.updated_at),
})

const toMessage = (message: VchatMessage): Message => ({
  id: String(message.id),
  activityId: String(message.conversation),
  role: message.role,
  content: message.content,
  timestamp: formatTime(message.created_at),
})

const toSocketMessage = (message: Record<string, unknown>, activityId: string): Message => ({
  id: String(message.id ?? `${Date.now()}-assistant`),
  activityId,
  role: String(message.role ?? 'assistant') as Message['role'],
  content: String(message.content ?? ''),
  timestamp: formatTime(String(message.created_at ?? new Date().toISOString())),
})

const toBackgroundTask = (execution: VchatWorkflowExecution): BackgroundTask => ({
  id: String(execution.id),
  executionId: String(execution.id),
  activityId: String(execution.conversation),
  title: 'Regulatory profile',
  status: execution.status,
  subtitle: execution.website_url || execution.external_workflow_id,
  updatedAt: formatDate(execution.updated_at),
  questions: execution.status_payload?.questions ?? [],
  error: execution.error || execution.status_payload?.error || undefined,
})

const toBackgroundTaskEvent = (
  event: WorkflowEventPayload,
  activityId: string,
): BackgroundTask => ({
  id: String(event.execution_id),
  executionId: String(event.execution_id),
  activityId,
  title: event.title || 'Regulatory profile',
  status: event.status,
  subtitle: event.subtitle,
  updatedAt: formatDate(event.updated_at),
  questions: event.questions ?? [],
  error: event.error,
})

const toArtifact = (artifact: VchatArtifact): Artifact => ({
  id: String(artifact.id),
  activityId: String(artifact.conversation),
  title: artifact.title,
  type: artifact.artifact_type,
  updatedAt: formatDate(artifact.updated_at),
  content: artifact.content,
})

const formatDate = (value: string) =>
  new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

const formatTime = (value: string) =>
  new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
