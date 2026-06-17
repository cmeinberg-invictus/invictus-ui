import {
  createBrowserRouter,
  createMemoryRouter,
  Navigate,
  Outlet,
  type InitialEntry,
  type RouteObject,
} from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { ActivitiesPage } from '../pages/ActivitiesPage'
import { ActivityConversationPage } from '../pages/ActivityConversationPage'
import { ArtifactDetailPage } from '../pages/ArtifactDetailPage'
import { ArtifactsPage } from '../pages/ArtifactsPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { SettingsPage } from '../pages/SettingsPage'
import { useAuth } from '../lib/auth'

function RequireAuth() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export const appRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'activities', element: <ActivitiesPage /> },
          { path: 'activities/:activityId', element: <ActivityConversationPage /> },
          { path: 'artifacts', element: <ArtifactsPage /> },
          { path: 'artifacts/:artifactId', element: <ArtifactDetailPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]

export const appRouter = createBrowserRouter(appRoutes)

export const createTestRouter = (initialEntries: InitialEntry[] = ['/']) =>
  createMemoryRouter(appRoutes, { initialEntries })
