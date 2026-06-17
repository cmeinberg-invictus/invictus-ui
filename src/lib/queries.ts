import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './auth'
import {
  fetchActivities,
  fetchArtifacts,
  fetchCurrentUser,
  fetchMessages,
  fetchModels,
  fetchSkills,
  fetchTasks,
  fetchWorkflows,
  updateConversation,
} from './vchatApi'
import type { Activity } from '../types/domain'

export const queryKeys = {
  me: ['me'] as const,
  activities: ['activities'] as const,
  messages: (activityId: string | null) => ['messages', activityId] as const,
  tasks: ['tasks'] as const,
  artifacts: ['artifacts'] as const,
  models: ['models'] as const,
  skills: ['skills'] as const,
  workflows: ['workflows'] as const,
}

export function useMe() {
  const { request, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => fetchCurrentUser(request),
    enabled: isAuthenticated,
  })
}

export function useActivities() {
  const { request, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: queryKeys.activities,
    queryFn: () => fetchActivities(request),
    enabled: isAuthenticated,
  })
}

export function useMessages(activityId: string | null) {
  const { request, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: queryKeys.messages(activityId),
    queryFn: () => fetchMessages(request, activityId as string),
    enabled: isAuthenticated && Boolean(activityId),
  })
}

export function useTasks() {
  const { request, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: () => fetchTasks(request),
    enabled: isAuthenticated,
  })
}

export function useArtifacts() {
  const { request, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: queryKeys.artifacts,
    queryFn: () => fetchArtifacts(request),
    enabled: isAuthenticated,
  })
}

export function useModels() {
  const { request, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: queryKeys.models,
    queryFn: () => fetchModels(request),
    enabled: isAuthenticated,
  })
}

export function useSkills() {
  const { request, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: queryKeys.skills,
    queryFn: () => fetchSkills(request),
    enabled: isAuthenticated,
  })
}

export function useWorkflows() {
  const { request, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: queryKeys.workflows,
    queryFn: () => fetchWorkflows(request),
    enabled: isAuthenticated,
  })
}

/** Persist per-conversation model / skills / workflow selection. */
export function useUpdateConversation(activityId: string) {
  const { request } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<{ model_name: string; skill_names: string[]; workflow_name: string }>) =>
      updateConversation(request, activityId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<Activity[]>(queryKeys.activities, (current) =>
        current?.map((activity) => (activity.id === updated.id ? updated : activity)) ?? [updated],
      )
    },
  })
}
