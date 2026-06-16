import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        surfaceAlt: 'var(--color-surface-alt)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        textMuted: 'var(--color-text-muted)',
        textSubtle: 'var(--color-text-subtle)',
        accent: 'var(--color-accent)',
        accentStrong: 'var(--color-accent-strong)',
        accentSoft: 'var(--color-accent-soft)',
        messageAgent: 'var(--color-message-agent)',
        messageUser: 'var(--color-message-user)',
        composerBorder: 'var(--color-composer-border)',
        controlNeutral: 'var(--color-control-neutral)',
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        glass: 'var(--color-glass)',
        glassBorder: 'var(--color-glass-border)',
        brand: {
          DEFAULT: 'var(--color-accent)',
          200: 'var(--color-accent-strong)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        ios: 'var(--radius-ios)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        glass: 'var(--shadow-glass)',
        bubble: 'var(--shadow-bubble)',
      },
      spacing: {
        7: 'var(--space-7)',
        8: 'var(--space-8)',
      },
      size: {
        control: 'var(--size-control)',
        md: 'var(--size-md)',
        lg: 'var(--size-lg)',
      },
    },
  },
}

export default config
