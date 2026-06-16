import { useMemo, useState, type FormEvent } from 'react'
import { EmptyState } from '../../components/ui/EmptyState'
import { Panel } from '../../components/ui/Panel'
import { useAppState } from '../../store/AppStateProvider'
import { cn } from '../../lib/cn'

type ChatViewProps = {
  activityId: string
}

export function ChatView({ activityId }: ChatViewProps) {
  const { getMessagesByActivity, sendMessage } = useAppState()
  const messages = useMemo(() => getMessagesByActivity(activityId), [activityId, getMessagesByActivity])
  const [draft, setDraft] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const content = draft.trim()

    if (!content) {
      setSubmitError('Message cannot be empty.')
      return
    }

    sendMessage(activityId, content)
    setDraft('')
    setSubmitError(null)
  }

  return (
    <Panel className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="scroll-area flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length ? (
          messages.map((message) => (
            <article
              key={message.id}
              className={cn(
                'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                message.role === 'user'
                  ? 'ml-auto bg-accent text-white'
                  : message.role === 'assistant'
                    ? 'bg-surfaceAlt text-text'
                    : 'mx-auto bg-warning/15 text-warning',
              )}
            >
              <p>{message.content}</p>
              <p
                className={cn(
                  'mt-1 text-[11px]',
                  message.role === 'user' ? 'text-white/80' : 'text-textMuted',
                )}
              >
                {message.timestamp}
              </p>
            </article>
          ))
        ) : (
          <EmptyState
            title="No messages yet"
            description="Write your first message to start this activity conversation."
          />
        )}
      </div>

      <form className="border-t border-border p-4" onSubmit={onSubmit}>
        <label htmlFor="chat-input" className="mb-2 block text-xs font-medium uppercase text-textMuted">
          Message
        </label>
        <textarea
          id="chat-input"
          name="message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="Type / for commands"
          className="w-full resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm text-text outline-none ring-accent transition placeholder:text-textMuted focus:ring-2"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          {submitError ? (
            <p className="text-sm text-danger" role="alert">
              {submitError}
            </p>
          ) : (
            <p className="text-xs text-textMuted">Messages are mocked for this scaffold.</p>
          )}
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-3 text-sm font-medium text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Send
          </button>
        </div>
      </form>
    </Panel>
  )
}
