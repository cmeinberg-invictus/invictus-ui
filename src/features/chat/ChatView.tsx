import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Icon } from '../../components/ui/Icon'
import { IconButton } from '../../components/ui/IconButton'
import { Panel } from '../../components/ui/Panel'
import { cn } from '../../lib/cn'
import { useAppState } from '../../store/AppStateProvider'
import type { Message } from '../../types/domain'

type ChatViewProps = {
  activityId: string
}

const NEW_MESSAGE_SCROLL_THRESHOLD = 48

const isScrollAreaNearBottom = (element: HTMLDivElement) =>
  element.scrollHeight - element.scrollTop - element.clientHeight <= NEW_MESSAGE_SCROLL_THRESHOLD

export function ChatView({ activityId }: ChatViewProps) {
  const { getMessagesByActivity, sendMessage, startRegProfile, submitRegProfileAnswers, tasks } =
    useAppState()
  const messages = useMemo(
    () => getMessagesByActivity(activityId),
    [activityId, getMessagesByActivity],
  )
  const [draft, setDraft] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [workflowError, setWorkflowError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isNearBottomRef = useRef(true)
  const [hasNewMessagesBelow, setHasNewMessagesBelow] = useState(false)
  const seenMessageIdsRef = useRef<{
    activityId: string
    ids: Set<string>
  } | null>(null)
  const [incomingMessages, setIncomingMessages] = useState<{
    activityId: string
    ids: Set<string>
  }>({
    activityId,
    ids: new Set(),
  })

  const scrollToLatestMessages = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const scrollArea = scrollAreaRef.current

    if (!scrollArea) {
      return
    }

    if (typeof scrollArea.scrollTo === 'function') {
      scrollArea.scrollTo({
        top: scrollArea.scrollHeight,
        behavior,
      })
    } else {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }

    isNearBottomRef.current = true
    setHasNewMessagesBelow(false)
  }, [])

  const updateScrollPosition = useCallback(() => {
    const scrollArea = scrollAreaRef.current

    if (!scrollArea) {
      return
    }

    const isNearBottom = isScrollAreaNearBottom(scrollArea)
    isNearBottomRef.current = isNearBottom

    if (isNearBottom) {
      setHasNewMessagesBelow(false)
    }
  }, [])

  useEffect(() => {
    const currentIds = new Set(messages.map((message) => message.id))
    const seenMessageIds = seenMessageIdsRef.current

    if (!seenMessageIds || seenMessageIds.activityId !== activityId) {
      seenMessageIdsRef.current = { activityId, ids: currentIds }
      setIncomingMessages({ activityId, ids: new Set() })
      isNearBottomRef.current = true
      setHasNewMessagesBelow(false)
      return
    }

    const newMessageIds = messages
      .filter((message) => !seenMessageIds.ids.has(message.id))
      .map((message) => message.id)

    seenMessageIdsRef.current = { activityId, ids: currentIds }
    setIncomingMessages({ activityId, ids: new Set(newMessageIds) })

    if (!newMessageIds.length) {
      return
    }

    if (isNearBottomRef.current) {
      window.requestAnimationFrame(() => scrollToLatestMessages())
      return
    }

    setHasNewMessagesBelow(true)
  }, [activityId, messages, scrollToLatestMessages])

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

  const waitingTask = tasks.find(
    (task) =>
      task.activityId === activityId && task.status === 'waiting_for_answers' && task.executionId,
  )

  const onStartRegProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const url = websiteUrl.trim()
    if (!url) {
      setWorkflowError('Website URL is required.')
      return
    }
    try {
      await startRegProfile(activityId, url)
      setWebsiteUrl('')
      setWorkflowError(null)
    } catch (error) {
      setWorkflowError(error instanceof Error ? error.message : 'Unable to start workflow.')
    }
  }

  const onSubmitAnswers = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!waitingTask?.executionId) {
      return
    }
    try {
      await submitRegProfileAnswers(waitingTask.executionId, answers)
      setAnswers({})
      setWorkflowError(null)
    } catch (error) {
      setWorkflowError(error instanceof Error ? error.message : 'Unable to submit answers.')
    }
  }

  return (
    <Panel className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-surfaceContainerLow">
      <div
        ref={scrollAreaRef}
        className="scroll-area min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-6 pt-6"
        aria-live="polite"
        onScroll={updateScrollPosition}
      >
        {messages.length ? (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isIncoming={
                incomingMessages.activityId === activityId && incomingMessages.ids.has(message.id)
              }
            />
          ))
        ) : (
          <EmptyState
            title="No messages yet"
            description="Write your first message to start this activity conversation."
          />
        )}
      </div>

      <div className="shrink-0 border-t border-[color:var(--surface-border)] px-3 py-3">
        <form className="flex flex-col gap-2 sm:flex-row" onSubmit={onStartRegProfile}>
          <label htmlFor="regprofile-url" className="sr-only">
            Company website URL
          </label>
          <input
            id="regprofile-url"
            type="url"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            placeholder="Start RegProfile from website URL"
            className="focus-brand min-h-10 flex-1 rounded-pill border border-[color:var(--surface-border)] bg-surfaceContainer px-4 text-body-md text-text placeholder:text-textSubtle"
          />
          <Button type="submit" variant="tonal" size="sm">
            Start RegProfile
          </Button>
        </form>

        {waitingTask?.questions?.length ? (
          <form
            className="mt-3 space-y-3 rounded-xl bg-surfaceContainer p-3"
            onSubmit={onSubmitAnswers}
          >
            <div>
              <p className="text-body-md font-medium text-text">RegProfile needs clarification</p>
              <p className="text-label-md text-textMuted">
                Answer the questions to continue the Temporal workflow.
              </p>
            </div>
            {waitingTask.questions.map((question, index) => {
              const key = question.id || `question-${index}`
              const label =
                question.question || question.label || question.text || `Question ${index + 1}`
              return (
                <div key={key} className="space-y-1">
                  <label htmlFor={`answer-${key}`} className="text-label-md font-medium text-text">
                    {label}
                  </label>
                  <textarea
                    id={`answer-${key}`}
                    value={answers[key] ?? ''}
                    onChange={(event) =>
                      setAnswers((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    rows={2}
                    className="focus-brand w-full rounded-xl border border-[color:var(--surface-border)] bg-surfaceContainerLow px-3 py-2 text-body-md text-text"
                  />
                </div>
              )
            })}
            <Button type="submit" variant="primary" size="sm">
              Submit answers
            </Button>
          </form>
        ) : null}

        {workflowError ? (
          <p className="mt-2 text-sm text-error" role="alert">
            {workflowError}
          </p>
        ) : null}
      </div>

      {hasNewMessagesBelow ? (
        <IconButton
          variant="glass"
          size="lg"
          className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 shadow-e4"
          aria-label="Scroll to latest messages"
          onClick={() => scrollToLatestMessages()}
        >
          <Icon name="chevronDown" className="h-5 w-5" />
        </IconButton>
      ) : null}

      <form className="relative z-20 shrink-0 px-3 pb-4 pt-2" onSubmit={onSubmit}>
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>

        <div className="composer-surface flex items-center gap-2 rounded-xl p-2">
          <IconButton variant="outlined" size="sm" aria-label="Add attachment">
            <Icon name="plus" className="h-4 w-4" />
          </IconButton>
          <textarea
            id="chat-input"
            name="message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={1}
            placeholder="Chat with Verena..."
            aria-invalid={Boolean(submitError)}
            aria-describedby="chat-support-text"
            className="max-h-32 min-h-[44px] w-full resize-y bg-transparent py-3 text-[15px] text-text outline-none placeholder:text-textSubtle"
          />
          <IconButton variant="filled" size="sm" type="submit" aria-label="Send">
            <Icon name="arrowUp" className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </IconButton>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 px-1">
          {submitError ? (
            <p id="chat-support-text" className="text-sm text-error" role="alert">
              {submitError}
            </p>
          ) : (
            <p id="chat-support-text" className="w-full text-center text-[11px] text-textMuted">
              Verena can make mistakes, so please verify important outputs.
            </p>
          )}
        </div>
      </form>
    </Panel>
  )
}

type MessageBubbleProps = {
  message: Message
  isIncoming: boolean
}

function MessageBubble({ message, isIncoming }: MessageBubbleProps) {
  if (message.role === 'assistant') {
    return (
      <article
        className={cn(
          'flex w-fit max-w-[92%] items-end gap-3',
          isIncoming && 'chat-message-incoming',
        )}
      >
        <Avatar name="Verena" variant="agent" size="chat" />
        <div className="message-assistant rounded-bl-sm rounded-br-xl rounded-tl-xl rounded-tr-xl px-4 py-3">
          <p className="text-base leading-6 text-text">{message.content}</p>
          <p className="mt-1 text-xs text-textMuted">{message.timestamp}</p>
        </div>
      </article>
    )
  }

  if (message.role === 'system') {
    return (
      <article
        className={cn(
          'mx-auto max-w-[90%] rounded-pill border border-warning/40 bg-warningContainer px-3 py-1.5 text-center',
          isIncoming && 'chat-message-incoming',
        )}
      >
        <p className="text-xs text-onWarningContainer">{message.content}</p>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'message-user ml-auto w-fit max-w-[85%] rounded-bl-xl rounded-br-sm rounded-tl-xl rounded-tr-xl px-4 py-3',
        isIncoming && 'chat-message-incoming',
      )}
    >
      <p className="text-base leading-6">{message.content}</p>
      <p className="mt-1 text-xs text-onPrimaryContainer/80">{message.timestamp}</p>
    </article>
  )
}
