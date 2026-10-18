import { Link } from '@adonisjs/inertia/react'

type LogoProps = {
  size?: number
  label?: string
}

export default function Logo({ size = 26, label = 'Sismart' }: LogoProps) {
  return (
    <Link
      route="home"
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.28,
        color: 'var(--ink)',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" />
        <path d="M6.5 10.3V15c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4.7" />
        <path d="M21 8v5.5" />
        <circle cx="21" cy="15.2" r="1.3" fill="var(--accent)" stroke="none" />
      </svg>
      <span
        style={{
          fontWeight: 700,
          fontSize: size * 0.82,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </Link>
  )
}
