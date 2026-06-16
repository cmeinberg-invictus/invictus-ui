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
  type: 'spec' | 'notes' | 'checklist'
  updatedAt: string
}

export type Message = {
  id: string
  activityId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export type TaskStatus = 'running' | 'completed' | 'failed'

export type BackgroundTask = {
  id: string
  activityId: string
  title: string
  status: TaskStatus
  subtitle: string
  updatedAt: string
}
