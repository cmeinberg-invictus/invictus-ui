import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import { useTheme } from '../../theme/ThemeProvider'

type CodeBlockProps = {
  code: string
  language: string
}

const escapeHtml = (value: string) => value.replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function CodeBlock({ code, language }: CodeBlockProps) {
  const { theme } = useTheme()
  const [html, setHtml] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const shikiTheme = theme === 'dark' ? 'github-dark' : 'github-light'

  useEffect(() => {
    let active = true
    codeToHtml(code, { lang: language || 'text', theme: shikiTheme })
      .then((result) => {
        if (active) setHtml(result)
      })
      .catch(() => {
        if (active) setHtml(`<pre><code>${escapeHtml(code)}</code></pre>`)
      })
    return () => {
      active = false
    }
  }, [code, language, shikiTheme])

  return (
    <div className="group relative my-2 overflow-hidden rounded-lg border border-[color:var(--surface-border)]">
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(code).then(() => {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1200)
          })
        }}
        className="focus-brand absolute right-2 top-2 rounded bg-surfaceContainerHigh px-2 py-1 text-label-md text-textMuted opacity-0 transition group-hover:opacity-100"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      {html ? (
        // Shiki output, or escaped-text fallback set in the catch above.
        <div className="overflow-x-auto text-sm [&_pre]:m-0 [&_pre]:p-3" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="overflow-x-auto p-3 text-sm">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
