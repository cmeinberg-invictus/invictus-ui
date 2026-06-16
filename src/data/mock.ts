import type { Activity, Artifact, BackgroundTask, Message } from '../types/domain'

export const activities: Activity[] = [
  {
    id: 'session-persistence',
    title: 'Session persistence and data clearing bugs',
    updatedAt: '14m ago',
    excerpt: 'Fix onboarding + logout behavior and validate shared browser state.',
  },
  {
    id: 'langfuse-seed-script',
    title: 'Langfuse prompts seed script',
    updatedAt: '1h ago',
    excerpt: 'Populate tracing prompts and baseline observations.',
  },
  {
    id: 'custom-notifications',
    title: 'Custom notifications spec',
    updatedAt: '3h ago',
    excerpt: 'Define events, templates, and role visibility.',
  },
]

export const artifacts: Artifact[] = [
  {
    id: 'artifact-pr-89',
    activityId: 'session-persistence',
    title: 'PR Notes: onboarding-storage-user-scope',
    type: 'notes',
    updatedAt: '10m ago',
  },
  {
    id: 'artifact-test-plan',
    activityId: 'session-persistence',
    title: 'Manual two-user verification plan',
    type: 'checklist',
    updatedAt: '18m ago',
  },
  {
    id: 'artifact-spec-notifications',
    activityId: 'custom-notifications',
    title: 'Notification channel decision spec',
    type: 'spec',
    updatedAt: '2h ago',
  },
]

export const initialMessages: Message[] = [
  {
    id: 'm1',
    activityId: 'session-persistence',
    role: 'assistant',
    content:
      'Part 1 fixes are merged. Part 2 defines logout/session handling in `lib/client/logout.ts`.',
    timestamp: '13:54',
  },
  {
    id: 'm2',
    activityId: 'session-persistence',
    role: 'assistant',
    content: 'Verification: unit tests pass; manual multi-user browser repro is still pending.',
    timestamp: '13:55',
  },
  {
    id: 'm3',
    activityId: 'session-persistence',
    role: 'user',
    content: 'Open a PR with these notes and include the test status.',
    timestamp: '13:56',
  },
  {
    id: 'm4',
    activityId: 'session-persistence',
    role: 'assistant',
    content: 'PR opened: invictus-platform#89. Two commits pushed and checks are running.',
    timestamp: '13:57',
  },
]

export const initialBackgroundTasks: BackgroundTask[] = [
  {
    id: 'task-pr',
    activityId: 'session-persistence',
    title: 'Open PR with gh',
    status: 'completed',
    subtitle: 'Bash command',
    updatedAt: '15s',
  },
  {
    id: 'task-logout',
    activityId: 'session-persistence',
    title: 'Find login/logout auth flow',
    status: 'completed',
    subtitle: 'Agent',
    updatedAt: '1m 15s',
  },
  {
    id: 'task-storage',
    activityId: 'session-persistence',
    title: 'Find sessionStorage/localStorage usage',
    status: 'running',
    subtitle: 'Agent',
    updatedAt: '1m 20s',
  },
]
