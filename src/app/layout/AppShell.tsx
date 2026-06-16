import { useMemo, useState } from 'react'
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
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-composerBorder bg-bg md:block">
          <LeftNav />
        </aside>

        <div
          className={cn(
            'grid min-h-screen grid-cols-1',
            rightPanelOpen && 'xl:grid-cols-[minmax(0,1fr)_24rem]',
          )}
        >
          <section className="flex min-h-screen flex-col">
            <header className="shell-fade-top border-b border-composerBorder bg-bg/86 px-4 py-3 backdrop-blur-xl">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
                <IconButton
                  className="md:hidden"
                  onClick={() => setIsMobileNavOpen(true)}
                  variant="glass"
                  size="lg"
                  aria-label="Open navigation"
                >
                  <Icon name="menu" className="h-4 w-4" />
                </IconButton>

                <div className="flex-1 text-center md:text-left">
                  <p
                    className={cn(
                      'text-base font-semibold text-text',
                      heading === 'Verena' && 'font-heading text-[21px] leading-7 tracking-[0.03px]',
                    )}
                  >
                    {heading}
                  </p>
                  <p className="text-xs text-textMuted">{subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <IconButton variant="glass" size="lg" aria-label="Search workspace">
                    <Icon name="search" className="h-4 w-4" />
                  </IconButton>
                  {!rightPanelOpen && (
                    <IconButton
                      variant="glass"
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

            <main className="min-h-0 flex-1 bg-[radial-gradient(circle_at_top,rgba(125,53,233,0.11),transparent_40%),var(--color-bg)] p-4 md:p-6">
              <Outlet />
            </main>
          </section>

          {rightPanelOpen && (
            <div className="hidden border-l border-composerBorder xl:block">
              <RightPanel activityId={activityId ?? null} onClose={() => setRightPanelOpen(false)} />
            </div>
          )}
        </div>
      </div>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          <div className="w-72 border-r border-composerBorder bg-bg">
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
