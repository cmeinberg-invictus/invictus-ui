import { API_BASE_URL } from './config'

export type RequestOptions = {
  method?: string
  token?: string | null
  body?: unknown
  headers?: Record<string, string>
}

export type TokenPair = {
  access: string
  refresh: string
}

export type Tokens = {
  accessToken: string | null
  refreshToken: string | null
}

export async function doRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed: ${response.status}`)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export async function login(email: string, password: string): Promise<TokenPair> {
  return doRequest<TokenPair>('/auth/token/', {
    method: 'POST',
    body: { email, password },
  })
}

export async function register(email: string, password: string) {
  return doRequest('/auth/register/', {
    method: 'POST',
    body: { email, password },
  })
}

export async function refreshToken(refresh: string): Promise<{ access: string }> {
  return doRequest<{ access: string }>('/auth/token/refresh/', {
    method: 'POST',
    body: { refresh },
  })
}

/**
 * Issue an authenticated request, transparently refreshing the access token once
 * on failure and retrying. If the refreshed request also fails, tokens are
 * cleared so the app can fall back to the login screen.
 */
export async function authRequest<T>({
  path,
  accessToken,
  refresh,
  setTokens,
  clearTokens,
  options = {},
}: {
  path: string
  accessToken: string | null
  refresh: string | null
  setTokens: (tokens: Tokens) => void
  clearTokens: () => void
  options?: Omit<RequestOptions, 'token'>
}): Promise<T> {
  try {
    return await doRequest<T>(path, { ...options, token: accessToken })
  } catch (error) {
    if (!refresh) throw error
    const refreshed = await refreshToken(refresh)
    setTokens({ accessToken: refreshed.access, refreshToken: refresh })
    try {
      return await doRequest<T>(path, { ...options, token: refreshed.access })
    } catch (finalError) {
      clearTokens()
      throw finalError
    }
  }
}
