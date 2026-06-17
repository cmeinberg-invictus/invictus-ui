import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { AppProviders } from './AppProviders'
import { createTestRouter } from './router'
import { installBackendMock, seedAuth } from '../test/backendMock'

const renderRoute = (path: string) => {
  const router = createTestRouter([path])
  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

beforeEach(() => {
  localStorage.clear()
  installBackendMock()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('Verena SPA (unauthenticated)', () => {
  test('redirects protected routes to the login page', async () => {
    renderRoute('/')

    expect(await screen.findByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  test('logging in lands the user in the workspace shell', async () => {
    const user = userEvent.setup()
    renderRoute('/login')

    await user.type(await screen.findByLabelText(/email/i), 'jane.doe@invictus.ai')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(await screen.findByRole('navigation', { name: /primary/i })).toBeInTheDocument()
  })
})

describe('Verena SPA (authenticated)', () => {
  beforeEach(() => {
    seedAuth()
  })

  test('renders shell navigation and core menu entries', async () => {
    renderRoute('/')

    expect(await screen.findByRole('navigation', { name: /primary/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^activities$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^artifacts$/i })).toBeInTheDocument()
  })

  test('shows the signed-in user derived from /auth/me', async () => {
    renderRoute('/')

    expect(await screen.findAllByText(/jane doe/i)).not.toHaveLength(0)
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  test('restores activity context from a deep-link route', async () => {
    renderRoute('/activities/7')

    expect(
      await screen.findByRole('heading', { name: /session persistence and data clearing bugs/i }),
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/chat with verena/i)).toBeInTheDocument()
    expect(await screen.findByText(/manual multi-user browser repro is still pending/i)).toBeInTheDocument()
  })

  test('filters recent sessions with the nav search field', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    expect(
      await screen.findByRole('link', { name: /session persistence and data clearing bugs/i }),
    ).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: /search navigation/i }), 'nonexistent')

    expect(
      screen.queryByRole('link', { name: /session persistence and data clearing bugs/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByText(/no matching sessions/i)).toBeInTheDocument()
  })

  test('composer submit appends the user message and a streamed reply', async () => {
    const user = userEvent.setup()
    renderRoute('/activities/7')

    await user.type(await screen.findByLabelText(/^message$/i), 'Please summarize the latest checks.')
    await user.click(screen.getByRole('button', { name: /^send$/i }))

    expect(screen.getByText(/please summarize the latest checks\./i)).toBeInTheDocument()
    expect(await screen.findByText(/streamed reply/i)).toBeInTheDocument()
  })

  test('starts a RegProfile background task from chat', async () => {
    const user = userEvent.setup()
    renderRoute('/activities/7')

    await user.type(await screen.findByLabelText(/company website url/i), 'https://example.com')
    await user.click(screen.getByRole('button', { name: /start regprofile/i }))

    expect(await screen.findAllByText(/https:\/\/example\.com/i)).not.toHaveLength(0)
  })

  test('a ready regprofile run asks its clarification question in the chat thread', async () => {
    const user = userEvent.setup()
    renderRoute('/activities/7')

    await user.type(await screen.findByLabelText(/company website url/i), 'https://example.com')
    await user.click(screen.getByRole('button', { name: /start regprofile/i }))

    // The run starts as "running"; the status poll advances it to
    // "waiting_for_answers", which kicks off a conversational turn where the
    // assistant asks the question as a chat message (no separate form).
    expect(
      await screen.findByText(/what is your licensing status/i, undefined, { timeout: 5000 }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /submit answers/i })).not.toBeInTheDocument()
  })

  test('renders artifact markdown content', async () => {
    renderRoute('/artifacts/11')

    expect(
      await screen.findByRole('heading', { name: /pr notes: onboarding-storage-user-scope/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/markdown/i)).toBeInTheDocument()
  })

  test('theme toggle updates the data-theme attribute', async () => {
    const user = userEvent.setup()
    localStorage.setItem('verena-theme', 'light')
    renderRoute('/settings')

    expect(document.documentElement.dataset.theme).toBe('light')
    await user.click(await screen.findByRole('button', { name: /toggle theme/i }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
