import { urlFor } from '~/client'
import { usePage } from '@inertiajs/react'
import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { cn } from '~/lib/utils'

export type NavRoute = Parameters<typeof urlFor>[0]

export type NavItem = {
  label: string
  route: NavRoute
  icon?: LucideIcon
}

/**
 * Tautan yang menandai dirinya dengan `aria-current="page"` bila URL aktif
 * cocok dengan route-nya. Secara default URL bertingkat ikut dianggap cocok,
 * jadi tautan "Pengaturan" tetap aktif di "/settings/security". Pakai
 * `exact` bila hanya ingin mencocokkan route itu sendiri.
 */
export default function NavLink({
  route,
  exact = false,
  className,
  activeClassName,
  onClick,
  children,
}: {
  route: NavRoute
  exact?: boolean
  className?: string
  activeClassName?: string
  onClick?: () => void
  children: ReactNode
}) {
  const { url } = usePage()
  const href = urlFor(route)
  const path = url.split('?')[0]
  const isActive = exact ? path === href : path === href || path.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(className, isActive && activeClassName)}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}
