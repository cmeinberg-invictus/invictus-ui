import type { LinkProps } from 'react-router-dom'
import { Link } from 'react-router-dom'
import type { ButtonSize, ButtonVariant } from './Button'
import { getButtonClassName } from './Button'

type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function ButtonLink({ className, variant = 'secondary', size = 'md', ...props }: ButtonLinkProps) {
  return <Link className={getButtonClassName({ className, variant, size })} {...props} />
}
