type AvatarProps = {
  name: string
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

export function Avatar({ name }: AvatarProps) {
  return (
    <span
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white"
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  )
}
