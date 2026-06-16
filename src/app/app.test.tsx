import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, test } from 'vitest'
import { AppProviders } from './AppProviders'
import { createTestRouter } from './router'

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
})

describe('Verena SPA', () => {
  test('restores activity context from deep-link route', async () => {
    renderRoute('/activities/session-persistence')

    expect(
      await screen.findByRole('heading', { name: /session persistence and data clearing bugs/i }),
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/chat with verena/i)).toBeInTheDocument()
    expect(screen.getByText(/please verify important outputs/i)).toBeInTheDocument()
  })

  test('renders shell navigation and core menu entries', async () => {
    renderRoute('/')

    expect(await screen.findByRole('navigation', { name: /primary/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^activities$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^artifacts$/i })).toBeInTheDocument()
  })

  test('collapses and expands desktop navigation while preserving core links', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    await user.click(await screen.findByRole('button', { name: /collapse navigation/i }))

    expect(screen.getByRole('button', { name: /expand navigation/i })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^activities$/i })).toBeInTheDocument()
    expect(localStorage.getItem('verena-left-nav-collapsed')).toBe('true')

    await user.click(screen.getByRole('button', { name: /expand navigation/i }))

    expect(screen.getByRole('button', { name: /collapse navigation/i })).toHaveAttribute('aria-expanded', 'true')
    expect(localStorage.getItem('verena-left-nav-collapsed')).toBe('false')
  })

  test('toggles context panel without removing animated sidebar shell', async () => {
    const user = userEvent.setup()
    renderRoute('/activities/session-persistence')

    await user.click(await screen.findByRole('button', { name: /hide context panel/i }))

    expect(screen.getByRole('button', { name: /show context panel/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /hide context panel/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show context panel/i }))

    expect(screen.getByRole('button', { name: /hide context panel/i })).toBeInTheDocument()
  })

  test('collapses and expands context panel groups', async () => {
    const user = userEvent.setup()
    renderRoute('/activities/session-persistence')

    const artifactsToggle = await screen.findByRole('button', { name: /artifacts/i })
    const artifactsPanel = document.getElementById(artifactsToggle.getAttribute('aria-controls') ?? '')
    const artifactLink = screen.getByRole('link', {
      name: /pr notes: onboarding-storage-user-scope/i,
    })

    expect(artifactsPanel).toHaveAttribute('aria-hidden', 'false')
    expect(artifactsToggle).toHaveAttribute('aria-expanded', 'true')
    expect(artifactLink).toBeVisible()

    await user.click(artifactsToggle)

    expect(artifactsPanel).toHaveAttribute('aria-hidden', 'true')
    expect(artifactsToggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(artifactsToggle)

    expect(artifactsPanel).toHaveAttribute('aria-hidden', 'false')
    expect(artifactsToggle).toHaveAttribute('aria-expanded', 'true')
    expect(artifactLink).toBeVisible()
  })

  test('keeps mobile navigation mounted during exit animation', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    await user.click(await screen.findByRole('button', { name: /open navigation/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /close navigation/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  test('composer submit appends a new message', async () => {
    const user = userEvent.setup()
    renderRoute('/activities/session-persistence')
    const initialMessage = await screen.findByText(/manual multi-user browser repro is still pending/i)

    expect(initialMessage.closest('article')).not.toHaveClass('chat-message-incoming')

    await user.type(screen.getByLabelText(/message/i), 'Please summarize the latest checks.')
    await user.click(screen.getByRole('button', { name: /^send$/i }))

    const userMessage = screen.getByText(/please summarize the latest checks\./i)
    const assistantMessage = screen.getByText(/received\. i queued that update for activity/i)

    await waitFor(() => expect(userMessage.closest('article')).toHaveClass('chat-message-incoming'))
    expect(assistantMessage.closest('article')).toHaveClass('chat-message-incoming')
  })

  test('theme toggle updates data-theme attribute', async () => {
    const user = userEvent.setup()
    localStorage.setItem('verena-theme', 'light')
    renderRoute('/settings')

    expect(document.documentElement.dataset.theme).toBe('light')
    await user.click(await screen.findByRole('button', { name: /toggle theme/i }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
