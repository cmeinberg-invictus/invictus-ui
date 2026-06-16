import { Button } from '../components/ui/Button'
import { Panel } from '../components/ui/Panel'
import { useTheme } from '../theme/ThemeProvider'

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-text">User settings</h1>
        <p className="text-sm text-textMuted">Customize your Verena workspace preferences.</p>
      </header>

      <Panel className="flex items-center justify-between gap-4 p-4">
        <div>
          <h2 className="text-sm font-semibold text-text">Theme</h2>
          <p className="text-sm text-textMuted">
            Current theme: <span className="capitalize">{theme}</span>
          </p>
        </div>
        <Button onClick={toggleTheme} variant="secondary">
          Toggle theme
        </Button>
      </Panel>
    </div>
  )
}
