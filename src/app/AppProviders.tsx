import type { ReactNode } from 'react'
import { AppStateProvider } from '../store/AppStateProvider'
import { ThemeProvider } from '../theme/ThemeProvider'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AppStateProvider>{children}</AppStateProvider>
    </ThemeProvider>
  )
}
