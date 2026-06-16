import { useMemo, useState, type FormEvent } from 'react'
import { Avatar } from '../../components/ui/Avatar'
import { EmptyState } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icon'
import { IconButton } from '../../components/ui/IconButton'
import { Panel } from '../../components/ui/Panel'
import { useAppState } from '../../store/AppStateProvider'
import type { Message } from '../../types/domain'
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
    <Panel className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border-composerBorder bg-bg">
      <div className="chat-fade-top pointer-events-none absolute inset-x-0 top-0 z-10 h-36" />
      <div className="chat-fade-bottom pointer-events-none absolute inset-x-0 bottom-24 z-10 h-36" />

      <div className="scroll-area flex-1 space-y-3 overflow-y-auto px-4 pb-6 pt-24">
        {messages.length ? (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        ) : (
          <EmptyState
            title="No messages yet"
            description="Write your first message to start this activity conversation."
          />
        )}
      </div>

      <form className="relative z-20 px-3 pb-4 pt-2" onSubmit={onSubmit}>
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>

        <div className="chat-glass-input flex items-center gap-2 rounded-ios p-2">
          <IconButton variant="glass" size="sm" aria-label="Add attachment">
            <Icon name="plus" className="h-4 w-4" />
          </IconButton>
          <textarea
            id="chat-input"
            name="message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={1}
            placeholder="Chat with Verena..."
            className="max-h-32 min-h-[44px] w-full resize-y bg-transparent py-3 text-[15px] text-text outline-none placeholder:text-textSubtle"
          />
          <IconButton variant="default" size="sm" type="submit" aria-label="Send">
            <Icon name="arrowUp" className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </IconButton>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 px-1">
          {submitError ? (
            <p className="text-sm text-danger" role="alert">
              {submitError}
            </p>
          ) : (
            <p className="w-full text-center text-[11px] text-textMuted">
              Verena can make mistakes, tap and hold content to share feedback
            </p>
          )}
        </div>
      </form>
    </Panel>
  )
}

type MessageBubbleProps = {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'assistant') {
    return (
      <article className="flex max-w-[92%] items-end gap-3">
        <Avatar name="Verena" variant="agent" size="chat" />
        <div className="message-agent max-w-[305px] rounded-bl-xs rounded-br-xl rounded-tl-xl rounded-tr-xl px-4 py-3">
          <p className="text-base leading-6 text-text">{message.content}</p>
          <p className="mt-1 text-[11px] leading-[18px] text-textMuted">{message.timestamp}</p>
        </div>
      </article>
    )
  }

  if (message.role === 'system') {
    return (
      <article className="mx-auto max-w-[90%] rounded-pill border border-warning/35 bg-warning/10 px-3 py-1.5 text-center">
        <p className="text-xs text-warning">{message.content}</p>
      </article>
    )
  }

  return (
    <article className={cn('message-user ml-auto max-w-[85%] rounded-bl-xl rounded-br-xs rounded-tl-xl rounded-tr-xl px-4 py-3 text-white')}>
      <p className="text-base leading-6">{message.content}</p>
      <p className="mt-1 text-[11px] leading-[18px] text-white/85">{message.timestamp}</p>
    </article>
  )
}
