import { vi } from 'vitest'

/**
 * Lightweight in-memory stand-in for the vchat backend used by the integration
 * tests. Installs a `fetch` mock that routes by method + path and a minimal
 * `WebSocket` mock that streams a token + done frame back when a message is sent.
 */

const iso = '2026-06-17T13:55:00.000Z'

export const fixtures = {
  user: { id: 1, email: 'jane.doe@invictus.ai', is_staff: false, created_at: iso },
  conversations: [
    {
      id: 7,
      title: 'Session persistence and data clearing bugs',
      model_name: 'gpt-4o-mini',
      skill_names: [] as string[],
      workflow_name: '',
      created_at: iso,
      updated_at: iso,
    },
  ],
  messages: [
    {
      id: 1,
      conversation: 7,
      role: 'assistant',
      content: 'Verification: unit tests pass; manual multi-user browser repro is still pending.',
      created_at: iso,
    },
  ],
  tasks: [] as unknown[],
  artifacts: [
    {
      id: 11,
      conversation: 7,
      title: 'PR Notes: onboarding-storage-user-scope',
      artifact_type: 'notes',
      content: '# Notes\n\nSome **markdown** content.',
      updated_at: iso,
    },
  ],
  models: [
    { id: 1, provider: 'openai', model_name: 'gpt-4o-mini', display_name: 'GPT-4o mini', enabled: true },
  ],
  skills: [] as unknown[],
  workflows: [
    {
      id: 1,
      name: 'regulatory_profile',
      display_name: 'Regulatory profile',
      description: '',
      fields: [],
      enabled: true,
    },
  ],
}

const json = (data: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
  } as Response)

export type MockState = {
  createdConversations: unknown[]
  startedRuns: unknown[]
}

export function installBackendMock() {
  const state: MockState = { createdConversations: [], startedRuns: [] }

  const handler = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    const path = url.replace(/^https?:\/\/[^/]+\/api/, '')
    const method = (init?.method ?? 'GET').toUpperCase()

    if (path === '/auth/token/' && method === 'POST') {
      return json({ access: 'test-access', refresh: 'test-refresh' })
    }
    if (path === '/auth/register/' && method === 'POST') return json({}, 201)
    if (path === '/auth/me/') return json(fixtures.user)
    if (path === '/conversations/' && method === 'GET') return json(fixtures.conversations)
    if (path === '/conversations/' && method === 'POST') {
      const created = {
        id: 99,
        title: 'New session',
        model_name: '',
        skill_names: [],
        workflow_name: '',
        created_at: iso,
        updated_at: iso,
      }
      state.createdConversations.push(created)
      return json(created, 201)
    }
    if (/^\/conversations\/\d+\/messages\/$/.test(path)) return json(fixtures.messages)
    if (/^\/conversations\/\d+\/$/.test(path) && method === 'PATCH') {
      return json({ ...fixtures.conversations[0], ...JSON.parse(String(init?.body ?? '{}')) })
    }
    if (path === '/workflow-runs/' && method === 'GET') return json(fixtures.tasks)
    if (path === '/workflow-runs/' && method === 'POST') {
      const run = {
        id: 55,
        conversation: 7,
        external_workflow_id: 'wf-55',
        execution_type: 'regulatory_profile',
        status: 'running',
        website_url: JSON.parse(String(init?.body ?? '{}')).website_url ?? '',
        status_payload: {},
        error: '',
        updated_at: iso,
      }
      state.startedRuns.push(run)
      return json(run, 201)
    }
    if (path === '/workflow-artifacts/') return json(fixtures.artifacts)
    if (path === '/models/') return json(fixtures.models)
    if (path === '/skills/') return json(fixtures.skills)
    if (path === '/workflows/') return json(fixtures.workflows)

    return json(`Unhandled ${method} ${path}`, 404)
  }

  vi.stubGlobal('fetch', vi.fn(handler))
  vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket)
  return state
}

export function seedAuth() {
  localStorage.setItem('vchat.access_token', 'test-access')
  localStorage.setItem('vchat.refresh_token', 'test-refresh')
}

type Listener = (event: unknown) => void

class MockWebSocket {
  static instances: MockWebSocket[] = []
  url: string
  private listeners: Record<string, Listener[]> = {}

  constructor(url: string) {
    this.url = url
    MockWebSocket.instances.push(this)
    queueMicrotask(() => this.emit('open', {}))
  }

  addEventListener(type: string, cb: Listener) {
    ;(this.listeners[type] ??= []).push(cb)
  }

  removeEventListener() {}

  send() {
    this.emit('message', { data: JSON.stringify({ type: 'token', token: 'Streamed ' }) })
    this.emit('message', {
      data: JSON.stringify({
        type: 'done',
        message: { id: 999, role: 'assistant', content: 'Streamed reply', created_at: iso },
      }),
    })
  }

  close() {}

  private emit(type: string, event: unknown) {
    ;(this.listeners[type] ?? []).forEach((cb) => cb(event))
  }
}
