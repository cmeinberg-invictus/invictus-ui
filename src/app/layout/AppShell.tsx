import { useMemo, useState } from 'react'
import { Outlet, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { IconButton } from '../../components/ui/IconButton'
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
    <div className="min-h-screen bg-bg text-text">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-border bg-surface md:block">
          <LeftNav />
        </aside>

        <div
          className={cn(
            'grid min-h-screen grid-cols-1',
            rightPanelOpen && 'lg:grid-cols-[minmax(0,1fr)_22rem]',
          )}
        >
          <section className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-2">
                <IconButton
                  className="md:hidden"
                  onClick={() => setIsMobileNavOpen(true)}
                  aria-label="Open navigation"
                >
                  <span aria-hidden="true">☰</span>
                </IconButton>
                <p className="text-sm font-medium text-textMuted">{breadcrumb}</p>
              </div>
              {!rightPanelOpen && (
                <IconButton onClick={() => setRightPanelOpen(true)} aria-label="Show context panel">
                  <span aria-hidden="true">≡</span>
                </IconButton>
              )}
            </header>

            <main className="min-h-0 flex-1 p-4">
              <Outlet />
            </main>
          </section>

          {rightPanelOpen && (
            <div className="hidden border-l border-border lg:block">
              <RightPanel activityId={activityId ?? null} onClose={() => setRightPanelOpen(false)} />
            </div>
          )}
        </div>
      </div>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div className="w-72 border-r border-border bg-surface">
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
