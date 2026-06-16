import type { ReactNode, SVGProps } from 'react'

type IconName =
  | 'search'
  | 'plus'
  | 'close'
  | 'send'
  | 'menu'
  | 'activities'
  | 'artifacts'
  | 'wallet'
  | 'contacts'
  | 'connectors'
  | 'settings'
  | 'chevronRight'
  | 'chevronDown'
  | 'spark'
  | 'clock'
  | 'arrowUp'

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName
}

const pathsByName: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M15.8 15.8L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  plus: (
    <path
      d="M12 5V19M5 12H19"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  close: (
    <path
      d="M6 6L18 18M18 6L6 18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  send: (
    <path
      d="M6 12H18M18 12L13.5 7.5M18 12L13.5 16.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  menu: (
    <>
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </>
  ),
  activities: (
    <>
      <path d="M4 12h6l2-4 2 8 2-4h4" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <circle cx="5" cy="12" r="1.2" fill="currentColor" />
      <circle cx="19" cy="12" r="1.2" fill="currentColor" />
    </>
  ),
  artifacts: (
    <>
      <rect x="5" y="4.5" width="14" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9.5h8M8 13h8M8 16.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  wallet: (
    <>
      <rect x="4" y="7" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 7V5.5c0-.8.7-1.5 1.5-1.5h7" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15.5" cy="12.5" r="1.2" fill="currentColor" />
    </>
  ),
  contacts: (
    <>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M4 18.2c1.1-2.7 3.2-4.2 5-4.2s3.9 1.5 5 4.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.5 9.8a2.4 2.4 0 102.3 4.2M17.7 15.3c.9.4 1.7 1.4 2.3 2.9" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  connectors: (
    <>
      <circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="18" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="6" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="18" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8 6h8M6 8v8M18 8v8M8 18h8" stroke="currentColor" strokeWidth="1.4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path
        d="M12 4.2v2M12 17.8v2M4.2 12h2M17.8 12h2M6.5 6.5l1.4 1.4M16.1 16.1l1.4 1.4M6.5 17.5l1.4-1.4M16.1 7.9l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  chevronRight: <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />,
  chevronDown: <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />,
  spark: (
    <>
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z" fill="currentColor" />
      <circle cx="18.5" cy="5.5" r="1.1" fill="currentColor" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M12 8v4l2.7 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  arrowUp: (
    <path
      d="M12 18V7M12 7L7.5 11.5M12 7L16.5 11.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
}

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {pathsByName[name]}
    </svg>
  )
}
