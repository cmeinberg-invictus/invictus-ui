import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { Badge } from './Badge'
import { Button } from './Button'
import { Chip } from './Chip'

describe('Lumen primitives', () => {
  test('renders glass button with pill shape', () => {
    render(<Button variant="glass">Ask Verena</Button>)

    const button = screen.getByRole('button', { name: /ask verena/i })
    expect(button).toHaveClass('rounded-pill')
    expect(button).toHaveClass('chat-glass-input')
  })

  test('renders role-based badge label', () => {
    render(<Badge channel="agent" emphasis="high" label="Verena+" />)

    expect(screen.getByText(/verena\+/i)).toBeInTheDocument()
  })

  test('renders quick-action chip as interactive control', () => {
    render(<Chip icon="spark">Review evidence</Chip>)

    expect(screen.getByRole('button', { name: /review evidence/i })).toBeInTheDocument()
  })
})
