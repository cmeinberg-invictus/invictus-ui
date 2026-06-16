import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider } from 'react-router-dom'
import { describe, expect, test } from 'vitest'
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

  test('composer submit appends a new message', async () => {
    const user = userEvent.setup()
    renderRoute('/activities/session-persistence')

    await user.type(screen.getByLabelText(/message/i), 'Please summarize the latest checks.')
    await user.click(screen.getByRole('button', { name: /^send$/i }))

    expect(screen.getByText(/please summarize the latest checks\./i)).toBeInTheDocument()
    expect(screen.getByText(/received\. i queued that update for activity/i)).toBeInTheDocument()
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
