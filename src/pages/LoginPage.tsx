import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Panel } from '../components/ui/Panel'
import verenaLogoSymbol from '../assets/verena-logo-symbol.svg'
import { useAuth } from '../lib/auth'
import { useTheme } from '../theme/ThemeProvider'

type Mode = 'login' | 'register'

export function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, login, register } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'register') {
        await register(email, password)
      } else {
        await login(email, password)
      }
      navigate('/', { replace: true })
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unable to authenticate.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 text-text">
      <Button
        className="absolute right-4 top-4"
        variant="ghost"
        size="icon-md"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? '☀' : '☾'}
      </Button>

      <Panel className="w-full max-w-md space-y-5 rounded-xl p-6 shadow-e3">
        <div className="flex items-center gap-2">
          <img src={verenaLogoSymbol} alt="" aria-hidden="true" className="h-5 w-5" />
          <h1 className="type-title text-title-lg font-medium text-text">Verena by Invictus AI</h1>
        </div>
        <p className="text-body-md text-textMuted">
          {mode === 'login' ? 'Sign in to your workspace.' : 'Create your workspace account.'}
        </p>

        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label htmlFor="login-email" className="text-label-md font-medium text-text">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="focus-brand h-11 w-full rounded-xl border border-[color:var(--surface-border)] bg-surfaceContainer px-4 text-body-md text-text placeholder:text-textSubtle"
              placeholder="you@company.com"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="login-password" className="text-label-md font-medium text-text">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="focus-brand h-11 w-full rounded-xl border border-[color:var(--surface-border)] bg-surfaceContainer px-4 text-body-md text-text placeholder:text-textSubtle"
              placeholder="At least 8 characters"
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          {error ? (
            <p id="login-error" className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading || !email || password.length < 8}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          disabled={loading}
          onClick={() => {
            setMode((current) => (current === 'login' ? 'register' : 'login'))
            setError(null)
          }}
        >
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign in'}
        </Button>
      </Panel>
    </div>
  )
}
