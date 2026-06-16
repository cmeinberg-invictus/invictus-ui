type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface p-6 text-center">
      <h2 className="text-base font-semibold text-text">{title}</h2>
      <p className="mt-1 text-sm text-textMuted">{description}</p>
    </div>
  )
}
