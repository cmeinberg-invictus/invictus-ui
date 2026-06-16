import { Button } from '../components/ui/Button'
import { Panel } from '../components/ui/Panel'
import { useTheme } from '../theme/ThemeProvider'

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-headline-sm font-medium text-text">User settings</h1>
        <p className="text-body-md text-textMuted">Customize your Verena workspace preferences.</p>
      </header>

      <Panel className="flex items-center justify-between gap-4 p-4">
        <div>
          <h2 className="text-title-sm font-medium text-text">Theme</h2>
          <p className="text-body-md text-textMuted">
            Current theme: <span className="capitalize">{theme}</span>
          </p>
        </div>
        <Button onClick={toggleTheme} variant="tonal">
          Toggle theme
        </Button>
      </Panel>
    </div>
  )
}
