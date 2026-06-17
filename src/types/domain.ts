export type AppRouteKey = 'home' | 'activities' | 'artifacts' | 'settings'

export type Activity = {
  id: string
  title: string
  updatedAt: string
  excerpt: string
}

export type Artifact = {
  id: string
  activityId: string
  title: string
  type: 'spec' | 'notes' | 'checklist' | 'regulatory_profile'
  updatedAt: string
  content?: string
}

export type Message = {
  id: string
  activityId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export type TaskStatus = 'queued' | 'running' | 'waiting_for_answers' | 'completed' | 'failed'

export type BackgroundTask = {
  id: string
  activityId: string
  title: string
  status: TaskStatus
  subtitle: string
  updatedAt: string
  executionId?: string
  questions?: Array<{ id?: string; question?: string; label?: string; text?: string }>
  error?: string
}
