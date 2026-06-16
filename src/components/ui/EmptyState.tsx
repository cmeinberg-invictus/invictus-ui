type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-transparent bg-surfaceContainerLow p-6 text-center shadow-e1">
      <h2 className="text-title-md font-semibold text-text">{title}</h2>
      <p className="mt-2 text-sm text-textMuted">{description}</p>
    </div>
  )
}
