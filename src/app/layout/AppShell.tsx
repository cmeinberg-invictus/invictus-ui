import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { IconButton } from '../../components/ui/IconButton'
import { Icon } from '../../components/ui/Icon'
import { cn } from '../../lib/cn'
import { LeftNav } from './LeftNav'
import { RightPanel } from './RightPanel'

const LEFT_NAV_COLLAPSED_STORAGE_KEY = 'verena-left-nav-collapsed'
const MOBILE_NAV_ANIMATION_MS = 220

const getStoredLeftNavCollapsed = () => {
  try {
    return localStorage.getItem(LEFT_NAV_COLLAPSED_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

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
  const [isMobileNavClosing, setIsMobileNavClosing] = useState(false)
  const [isLeftNavCollapsed, setIsLeftNavCollapsed] = useState(getStoredLeftNavCollapsed)
  const mobileNavCloseTimeoutRef = useRef<number | null>(null)

  const rightPanelOpen = searchParams.get('rightPanel') !== 'closed'
  const isMobileNavRendered = isMobileNavOpen || isMobileNavClosing
  const breadcrumb = useMemo(() => getBreadcrumb(location.pathname), [location.pathname])
  const heading = location.pathname.startsWith('/activities/') ? 'Verena' : breadcrumb
  const subtitle = location.pathname.startsWith('/activities/') ? '' : 'Workspace overview'

  useEffect(() => {
    try {
      localStorage.setItem(LEFT_NAV_COLLAPSED_STORAGE_KEY, String(isLeftNavCollapsed))
    } catch {
      // Ignore storage failures; the nav still behaves correctly for the current session.
    }
  }, [isLeftNavCollapsed])

  const openMobileNav = useCallback(() => {
    if (mobileNavCloseTimeoutRef.current) {
      window.clearTimeout(mobileNavCloseTimeoutRef.current)
      mobileNavCloseTimeoutRef.current = null
    }
    setIsMobileNavClosing(false)
    setIsMobileNavOpen(true)
  }, [])

  const closeMobileNav = useCallback(() => {
    if (!isMobileNavOpen) {
      return
    }

    setIsMobileNavOpen(false)
    setIsMobileNavClosing(true)

    if (mobileNavCloseTimeoutRef.current) {
      window.clearTimeout(mobileNavCloseTimeoutRef.current)
    }

    mobileNavCloseTimeoutRef.current = window.setTimeout(() => {
      setIsMobileNavClosing(false)
      mobileNavCloseTimeoutRef.current = null
    }, MOBILE_NAV_ANIMATION_MS)
  }, [isMobileNavOpen])

  useEffect(() => {
    if (!isMobileNavRendered) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileNav()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [closeMobileNav, isMobileNavRendered])

  useEffect(() => {
    return () => {
      if (mobileNavCloseTimeoutRef.current) {
        window.clearTimeout(mobileNavCloseTimeoutRef.current)
      }
    }
  }, [])

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
    <div className="h-screen overflow-hidden bg-background text-text">
      <div
        className={cn(
          'app-shell-grid grid h-screen min-h-0 grid-cols-1 overflow-hidden',
          isLeftNavCollapsed && 'is-left-nav-collapsed',
        )}
      >
        <aside className="shell-sidebar-left hidden h-screen overflow-hidden md:block">
          <LeftNav
            isCollapsed={isLeftNavCollapsed}
            onToggleCollapsed={() => setIsLeftNavCollapsed((isCollapsed) => !isCollapsed)}
          />
        </aside>

        <div
          className={cn(
            'app-content-grid grid h-screen min-h-0 grid-cols-1 overflow-hidden',
            rightPanelOpen && 'is-context-panel-open',
          )}
        >
          <section className="flex h-screen min-h-0 flex-col overflow-hidden">
            <header className="top-app-bar z-20 shrink-0 px-4 py-4">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
                <IconButton
                  className="md:hidden"
                  onClick={openMobileNav}
                  variant="ghost"
                  size="md"
                  aria-label="Open navigation"
                >
                  <Icon name="menu" className="h-4 w-4" />
                </IconButton>

                <div className="flex-1 text-center md:text-left">
                  <p
                    className={cn(
                      'type-title text-title-md font-medium text-text',
                      heading === 'Verena' && 'text-title-lg',
                    )}
                  >
                    {heading}
                  </p>
                  {subtitle ? <p className="text-label-md text-textMuted">{subtitle}</p> : null}
                </div>

                <div className="flex items-center gap-2">
                  <IconButton variant="ghost" size="md" aria-label="Search workspace">
                    <Icon name="search" className="h-4 w-4" />
                  </IconButton>
                  {!rightPanelOpen && (
                    <IconButton
                      variant="ghost"
                      size="md"
                      onClick={() => setRightPanelOpen(true)}
                      aria-label="Show context panel"
                    >
                      <Icon name="chevronRight" className="h-4 w-4" />
                    </IconButton>
                  )}
                </div>
              </div>
            </header>

            <main className="app-stage scroll-area min-h-0 flex-1 overflow-y-auto p-5 md:p-8" id="main-content">
              <Outlet />
            </main>
          </section>

          <div
            className={cn(
              'shell-sidebar-right shell-sidebar-right-animated hidden h-screen overflow-hidden xl:block',
              !rightPanelOpen && 'is-closed',
            )}
            aria-hidden={!rightPanelOpen}
          >
            <div className={cn('h-full', !rightPanelOpen && 'pointer-events-none')} inert={!rightPanelOpen}>
              <RightPanel activityId={activityId ?? null} onClose={() => setRightPanelOpen(false)} />
            </div>
          </div>
        </div>
      </div>

      {isMobileNavRendered && (
        <div
          className={cn(
            'mobile-nav-overlay fixed inset-0 z-50 flex md:hidden',
            isMobileNavOpen && 'is-open',
            isMobileNavClosing && 'is-closing',
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="mobile-nav-drawer shell-sidebar-left h-screen w-72 overflow-hidden">
            <LeftNav onNavigate={closeMobileNav} />
          </div>
          <button
            type="button"
            className="mobile-nav-scrim w-full bg-black/50"
            aria-label="Close navigation"
            onClick={closeMobileNav}
          />
        </div>
      )}
    </div>
  )
}
