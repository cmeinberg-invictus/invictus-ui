import type { Requester } from './auth'
import { WS_BASE_URL } from './config'
import {
  conversationListSchema,
  conversationSchema,
  messageListSchema,
  modelConfigListSchema,
  skillListSchema,
  userSchema,
  workflowArtifactListSchema,
  workflowExecutionListSchema,
  workflowExecutionSchema,
  workflowListSchema,
  type ModelConfig,
  type Skill,
  type VchatArtifact,
  type VchatConversation,
  type VchatMessage,
  type VchatUser,
  type VchatWorkflowExecution,
  type Workflow,
} from './schemas'
import type { Activity, Artifact, BackgroundTask, CurrentUser, Message } from '../types/domain'

export type WorkflowEventPayload = {
  execution_id: number
  execution_type: string
  status: BackgroundTask['status']
  title: string
  subtitle: string
  questions?: BackgroundTask['questions']
  error?: string
  updated_at: string
}

// --- Reads ---------------------------------------------------------------

export const fetchCurrentUser = async (request: Requester): Promise<CurrentUser> => {
  const user = userSchema.parse(await request('/auth/me/'))
  return toCurrentUser(user)
}

export const fetchActivities = async (request: Requester): Promise<Activity[]> => {
  const conversations = conversationListSchema.parse(await request('/conversations/'))
  return conversations.map(toActivity)
}

export const fetchMessages = async (
  request: Requester,
  activityId: string,
): Promise<Message[]> => {
  const messages = messageListSchema.parse(
    await request(`/conversations/${activityId}/messages/`),
  )
  return messages.map(toMessage)
}

export const fetchTasks = async (request: Requester): Promise<BackgroundTask[]> => {
  const executions = workflowExecutionListSchema.parse(await request('/workflow-runs/'))
  return executions.map(toBackgroundTask)
}

export const fetchArtifacts = async (request: Requester): Promise<Artifact[]> => {
  const artifacts = workflowArtifactListSchema.parse(await request('/workflow-artifacts/'))
  return artifacts.map(toArtifact)
}

export const fetchModels = async (request: Requester): Promise<ModelConfig[]> =>
  modelConfigListSchema.parse(await request('/models/'))

export const fetchSkills = async (request: Requester): Promise<Skill[]> =>
  skillListSchema.parse(await request('/skills/'))

export const fetchWorkflows = async (request: Requester): Promise<Workflow[]> =>
  workflowListSchema.parse(await request('/workflows/'))

// --- Writes --------------------------------------------------------------

export const createConversation = async (
  request: Requester,
  payload: {
    title: string
    model_name?: string
    skill_names?: string[]
    workflow_name?: string
  },
): Promise<Activity> => {
  const conversation = conversationSchema.parse(
    await request('/conversations/', { method: 'POST', body: payload }),
  )
  return toActivity(conversation)
}

export const updateConversation = async (
  request: Requester,
  activityId: string,
  payload: Partial<{
    title: string
    model_name: string
    skill_names: string[]
    workflow_name: string
  }>,
): Promise<Activity> => {
  const conversation = conversationSchema.parse(
    await request(`/conversations/${activityId}/`, { method: 'PATCH', body: payload }),
  )
  return toActivity(conversation)
}

export const fetchRegProfileStatus = async (
  request: Requester,
  executionId: string,
): Promise<BackgroundTask> => {
  const execution = workflowExecutionSchema.parse(
    await request(`/workflow-runs/${executionId}/status/`),
  )
  return toBackgroundTask(execution)
}

export const startRegProfileWorkflow = async (
  request: Requester,
  activityId: string,
  websiteUrl: string,
): Promise<BackgroundTask> => {
  const execution = workflowExecutionSchema.parse(
    await request('/workflow-runs/', {
      method: 'POST',
      body: { conversation: Number(activityId), website_url: websiteUrl },
    }),
  )
  return toBackgroundTask(execution)
}

export const submitRegProfileAnswers = async (
  request: Requester,
  executionId: string,
  answers: Record<string, string>,
): Promise<BackgroundTask> => {
  const execution = workflowExecutionSchema.parse(
    await request(`/workflow-runs/${executionId}/answers/`, {
      method: 'POST',
      body: { answers },
    }),
  )
  return toBackgroundTask(execution)
}

// --- WebSocket -----------------------------------------------------------

export const openChatSocket = (
  activityId: string,
  token: string,
  handlers: {
    onToken: (token: string) => void
    onDone: (message: Message) => void
    onTask: (task: BackgroundTask) => void
    onError: (error: string) => void
  },
) => {
  const socket = new WebSocket(
    `${WS_BASE_URL}/chat/${activityId}/?token=${encodeURIComponent(token)}`,
  )

  socket.addEventListener('message', (event) => {
    let payload: Record<string, unknown>
    try {
      payload = JSON.parse(event.data)
    } catch {
      handlers.onError('Invalid websocket payload.')
      return
    }
    if (payload.type === 'token') {
      handlers.onToken(String(payload.token ?? ''))
      return
    }
    if (payload.type === 'done' && payload.message) {
      handlers.onDone(toSocketMessage(payload.message as Record<string, unknown>, activityId))
      return
    }
    if (payload.type === 'background_task') {
      handlers.onTask(toBackgroundTaskEvent(payload as unknown as WorkflowEventPayload, activityId))
      return
    }
    if (payload.type === 'error') {
      handlers.onError(String(payload.error ?? 'Unknown chat error'))
    }
  })

  socket.addEventListener('error', () => {
    handlers.onError('WebSocket connection error.')
  })

  return socket
}

// --- Mappers (vchat backend -> invictus domain) --------------------------

const toCurrentUser = (user: VchatUser): CurrentUser => ({
  id: String(user.id),
  email: user.email,
  name: nameFromEmail(user.email),
})

const toActivity = (conversation: VchatConversation): Activity => ({
  id: String(conversation.id),
  title: conversation.title || `Conversation ${conversation.id}`,
  excerpt: conversation.model_name ? `Model: ${conversation.model_name}` : 'Chat activity',
  updatedAt: formatDate(conversation.updated_at),
  modelName: conversation.model_name || undefined,
  skillNames: conversation.skill_names,
  workflowName: conversation.workflow_name || undefined,
})

const toMessage = (message: VchatMessage): Message => ({
  id: String(message.id),
  activityId: String(message.conversation),
  role: message.role,
  content: message.content,
  timestamp: formatTime(message.created_at),
})

const toSocketMessage = (message: Record<string, unknown>, activityId: string): Message => ({
  id: String(message.id ?? `${activityId}-assistant-${message.created_at ?? ''}`),
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

const nameFromEmail = (email: string) => {
  const handle = email.split('@')[0] ?? email
  return handle
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
    || email
}

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

const formatTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(date)
}
