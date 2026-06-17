import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  authRequest,
  login as loginRequest,
  register as registerRequest,
  type RequestOptions,
  type Tokens,
} from './api'

const ACCESS_TOKEN_KEY = 'vchat.access_token'
const REFRESH_TOKEN_KEY = 'vchat.refresh_token'

type AuthState = Tokens

export type Requester = <T>(path: string, options?: Omit<RequestOptions, 'token'>) => Promise<T>

type AuthContextValue = AuthState & {
  isAuthenticated: boolean
  setTokens: (tokens: AuthState) => void
  clearTokens: () => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  /** Authenticated request bound to the current tokens, with refresh-and-retry. */
  request: Requester
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const readStoredTokens = (): AuthState => {
  try {
    return {
      accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    }
  } catch {
    return { accessToken: null, refreshToken: null }
  }
}

const persistTokens = (tokens: AuthState) => {
  try {
    if (tokens.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  } catch {
    // Ignore storage failures; tokens still live in memory for this session.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(readStoredTokens)

  const value = useMemo<AuthContextValue>(() => {
    const setTokens = (tokens: AuthState) => {
      persistTokens(tokens)
      setState(tokens)
    }
    const clearTokens = () => {
      persistTokens({ accessToken: null, refreshToken: null })
      setState({ accessToken: null, refreshToken: null })
    }

    const request: Requester = (path, options) =>
      authRequest({
        path,
        accessToken: state.accessToken,
        refresh: state.refreshToken,
        setTokens,
        clearTokens,
        options,
      })

    return {
      ...state,
      isAuthenticated: Boolean(state.accessToken),
      setTokens,
      clearTokens,
      async login(email, password) {
        const tokens = await loginRequest(email, password)
        setTokens({ accessToken: tokens.access, refreshToken: tokens.refresh })
      },
      async register(email, password) {
        await registerRequest(email, password)
        const tokens = await loginRequest(email, password)
        setTokens({ accessToken: tokens.access, refreshToken: tokens.refresh })
      },
      logout: clearTokens,
      request,
    }
  }, [state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
