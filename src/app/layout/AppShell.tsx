import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { IconButton } from '../../components/ui/IconButton'
import { Icon } from '../../components/ui/Icon'
import { cn } from '../../lib/cn'
import { LeftNav } from './LeftNav'
import { RightPanel } from './RightPanel'

const getBreadcrumb = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean)
  if (!segments.length) {
    return 'Home'
  }

  return segments
    .map((segment) => segment.replace(/-/g, ' '))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' / ')
}

export function AppShell() {
  const location = useLocation()
  const { activityId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const rightPanelOpen = searchParams.get('rightPanel') !== 'closed'
  const breadcrumb = useMemo(() => getBreadcrumb(location.pathname), [location.pathname])
  const heading = location.pathname.startsWith('/activities/') ? 'Verena' : breadcrumb
  const subtitle = location.pathname.startsWith('/activities/')
    ? 'Chat context'
    : 'Workspace overview'

  useEffect(() => {
    if (!isMobileNavOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isMobileNavOpen])

  const setRightPanelOpen = (open: boolean) => {
    const next = new URLSearchParams(searchParams)
    if (open) {
      next.delete('rightPanel')
    } else {
      next.set('rightPanel', 'closed')
    }
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="shell-sidebar-left hidden md:block">
          <LeftNav />
        </aside>

        <div
          className={cn(
            'grid min-h-screen grid-cols-1',
            rightPanelOpen && 'xl:grid-cols-[minmax(0,1fr)_24rem]',
          )}
        >
          <section className="flex min-h-screen flex-col">
            <header className="top-app-bar sticky top-0 z-20 px-4 py-3">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
                <IconButton
                  className="md:hidden"
                  onClick={() => setIsMobileNavOpen(true)}
                  variant="default"
                  size="lg"
                  aria-label="Open navigation"
                >
                  <Icon name="menu" className="h-4 w-4" />
                </IconButton>

                <div className="flex-1 text-center md:text-left">
                  <p
                    className={cn(
                      'text-base font-semibold text-text',
                      heading === 'Verena' && 'text-xl',
                    )}
                  >
                    {heading}
                  </p>
                  <p className="text-sm text-textMuted">{subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <IconButton variant="default" size="lg" aria-label="Search workspace">
                    <Icon name="search" className="h-4 w-4" />
                  </IconButton>
                  {!rightPanelOpen && (
                    <IconButton
                      variant="default"
                      size="lg"
                      onClick={() => setRightPanelOpen(true)}
                      aria-label="Show context panel"
                    >
                      <Icon name="chevronRight" className="h-4 w-4" />
                    </IconButton>
                  )}
                </div>
              </div>
            </header>

            <main className="app-stage min-h-0 flex-1 p-4 md:p-6" id="main-content">
              <Outlet />
            </main>
          </section>

          {rightPanelOpen && (
            <div className="shell-sidebar-right hidden xl:block">
              <RightPanel activityId={activityId ?? null} onClose={() => setRightPanelOpen(false)} />
            </div>
          )}
        </div>
      </div>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div className="shell-sidebar-left w-72">
            <LeftNav onNavigate={() => setIsMobileNavOpen(false)} />
          </div>
          <button
            type="button"
            className="w-full bg-black/50"
            aria-label="Close navigation"
            onClick={() => setIsMobileNavOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
