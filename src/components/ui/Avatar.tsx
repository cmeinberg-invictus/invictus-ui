import verenaAvatar from '../../assets/verena-avatar.svg'

type AvatarProps = {
  name: string
  variant?: 'agent' | 'customer'
  size?: 'sm' | 'md' | 'chat'
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

export function Avatar({ name, variant = 'customer', size = 'md' }: AvatarProps) {
  const sizeClass = size === 'sm' ? 'h-8 w-8' : size === 'chat' ? 'h-11 w-11' : 'h-10 w-10'

  if (variant === 'agent') {
    return (
      <img
        src={verenaAvatar}
        alt=""
        aria-hidden="true"
        className={`${sizeClass} rounded-full border border-glassBorder bg-surface object-cover`}
      />
    )
  }

  return (
    <span
      className={`inline-flex ${sizeClass} items-center justify-center rounded-full bg-accent text-xs font-semibold text-white`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  )
}
