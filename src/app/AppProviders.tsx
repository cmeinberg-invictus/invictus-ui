import { useState, type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { AppStateProvider } from '../store/AppStateProvider'
import { AuthProvider } from '../lib/auth'
import { createQueryClient } from '../lib/queryClient'
import { ThemeProvider } from '../theme/ThemeProvider'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient)

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppStateProvider>{children}</AppStateProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
