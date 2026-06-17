import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../../lib/cn'
import { CodeBlock } from './CodeBlock'

type MarkdownProps = {
  content: string
  className?: string
}

/**
 * Renders backend-produced markdown (chat replies, regulatory-profile artifacts)
 * with GitHub-flavored markdown and Shiki-highlighted code blocks. Styling stays
 * on design tokens so it works in both themes.
 */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        'space-y-2 text-base leading-6 text-text',
        '[&_a]:text-primary [&_a]:underline',
        '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_h1]:text-title-lg [&_h2]:text-title-md [&_h3]:text-title-sm [&_h1]:font-medium [&_h2]:font-medium [&_h3]:font-medium',
        '[&_table]:w-full [&_th]:border [&_td]:border [&_th]:border-[color:var(--surface-border)] [&_td]:border-[color:var(--surface-border)] [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { className: codeClassName, children } = props
            const match = /language-(\w+)/.exec(codeClassName ?? '')
            const isBlock = Boolean(match) || String(children).includes('\n')
            if (!isBlock) {
              return (
                <code className="rounded bg-surfaceContainerHigh px-1 py-0.5 font-mono text-sm">
                  {children}
                </code>
              )
            }
            const code = String(children).replace(/\n$/, '')
            return <CodeBlock code={code} language={match?.[1] ?? 'text'} />
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
