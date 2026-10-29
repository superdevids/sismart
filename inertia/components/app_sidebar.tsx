import { usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { ChevronDown, Minus, X } from 'lucide-react'
import { useEffect } from 'react'
import type { PanelMenuItem } from '#services/panel_menu_service'
import { urlFor } from '~/client'
import { type NavRoute } from '~/components/nav_link'
import { cn } from '~/lib/utils'
import Logo from '~/components/logo'

/**
 * Ikon menu dipilih lewat nama teks, bukan komponen React, karena menu
 * dikirim server sebagai data. Peta eksplisit dipakai (bukan `import *`)
 * supaya bundel hanya memuat ikon yang benar-benar dipakai.
 */
import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  FileChartColumn,
  GraduationCap,
  LayoutDashboard,
  Settings2,
  UsersRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export const MENU_ICONS: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  'settings-2': Settings2,
  'graduation-cap': GraduationCap,
  'wallet': Wallet,
  'calendar-check': CalendarCheck,
  'calendar-days': CalendarDays,
  'file-chart-column': FileChartColumn,
  'book-open': BookOpen,
  'clipboard-list': ClipboardList,
  'users-round': UsersRound,
}

type SidebarState = {
  isMobile: boolean
  isMobileOpen: boolean
  showLabels: boolean
  openSubmenu: string | null
  setIsHovered: (value: boolean) => void
  toggleSubmenu: (key: string) => void
  closeMobileSidebar: () => void
}

function isCurrent(url: string, href: string) {
  const path = url.split('?')[0]
  if (href === '/') return path === '/'
  return path === href || path.startsWith(`${href}/`)
}

/**
 * Nama route dari server sampai ke frontend sebagai `string`. Satu titik
 * konversi di sini membuat sisa komponen tetap bertipe ketat.
 */
function hrefOf(route: string): string {
  return urlFor(route as NavRoute)
}

/**
 * Sidebar mengikuti TailAdmin: lebar 290px saat melebar, 90px saat menciut,
 * melebar sementara saat kursor memasuki rail, dan tiap item berupa baris
 * penuh dengan ikon 24px.
 */
export default function AppSidebar(state: SidebarState) {
  const { url, props } = usePage()
  const menu = (props.menu ?? []) as PanelMenuItem[]
  const brand = props.brand
  const {
    isMobile,
    isMobileOpen,
    showLabels,
    openSubmenu,
    setIsHovered,
    toggleSubmenu,
    closeMobileSidebar,
  } = state

  // Laci mobile ditutup dengan Escape — kebiasaan dialog, mencegah user
  // terjebak tanpa jalan keluar selain mengklik overlay.
  useEffect(() => {
    if (!isMobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMobileSidebar()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMobileOpen, closeMobileSidebar])

  const collapsed = !isMobile && !showLabels

  return (
    <aside
      aria-label="Navigasi utama"
      onMouseEnter={() => {
        if (!isMobile) setIsHovered(true)
      }}
      onMouseLeave={() => {
        if (!isMobile) setIsHovered(false)
      }}
      className={cn(
        'fixed top-0 left-0 z-50 flex h-dvh flex-col border-r border-border bg-card text-card-foreground',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-[90px] px-0' : 'w-[290px] px-5',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        'xl:translate-x-0'
      )}
    >
      {/* Logo. TailAdmin memakai py-8 tanpa garis pemisah. */}
      <div className={cn('flex py-8', collapsed ? 'xl:justify-center' : 'justify-start')}>
        <Link
          route="home"
          aria-label={brand?.name ?? 'Sismart'}
          className="flex items-center gap-2.5"
        >
          <Logo size={collapsed ? 32 : 30} />
          {!collapsed && (
            <span className="truncate text-base font-semibold tracking-tight">
              {brand?.name ?? 'Sismart'}
            </span>
          )}
        </Link>
      </div>

      {isMobile && (
        <button
          type="button"
          onClick={closeMobileSidebar}
          className="absolute top-6 right-4 grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Tutup menu"
        >
          <X className="size-4" />
        </button>
      )}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={cn(
                  'mb-4 flex text-xs leading-5 text-muted-foreground uppercase',
                  collapsed ? 'xl:justify-center' : 'justify-start'
                )}
              >
                {collapsed ? <Minus className="size-4" aria-hidden="true" /> : 'Menu'}
              </h2>

              <ul className="flex flex-col gap-1">
                {menu.map((item, index) => {
                  const Icon = MENU_ICONS[item.icon]
                  const hasChildren = Boolean(item.children?.length)
                  const key = `${item.label}-${index}`
                  const open = openSubmenu === key
                  const childActive = Boolean(
                    item.children?.some((c) => c.route && isCurrent(url, hrefOf(c.route)))
                  )
                  const selfActive = Boolean(item.route && isCurrent(url, hrefOf(item.route)))
                  const active = selfActive || childActive

                  // Baris menu: px-3 py-2 gap-3 rounded-lg text-sm font-medium,
                  // sama dengan utility `menu-item` TailAdmin.
                  const rowClass = cn(
                    'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                    collapsed && 'xl:justify-center xl:px-0',
                    active
                      ? 'bg-primary-soft text-primary-ink'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                    item.disabled &&
                      'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-foreground/80'
                  )

                  const iconClass = cn(
                    'shrink-0',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )
                  const iconSize = 24

                  return (
                    <li key={key}>
                      {hasChildren ? (
                        <button
                          type="button"
                          onClick={() => toggleSubmenu(key)}
                          aria-expanded={open}
                          className={rowClass}
                        >
                          {Icon && (
                            <Icon size={iconSize} className={iconClass} aria-hidden="true" />
                          )}
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate text-left">{item.label}</span>
                              <ChevronDown
                                className={cn(
                                  'size-5 shrink-0 transition-transform duration-200',
                                  open ? 'rotate-180 text-primary' : 'text-muted-foreground'
                                )}
                                aria-hidden="true"
                              />
                            </>
                          )}
                          {collapsed && <RailTip label={item.label} />}
                        </button>
                      ) : item.disabled || !item.route ? (
                        <span className={rowClass} aria-disabled="true" title="Belum tersedia">
                          {Icon && (
                            <Icon size={iconSize} className={iconClass} aria-hidden="true" />
                          )}
                          {!collapsed && <span className="truncate">{item.label}</span>}
                          {collapsed && <RailTip label={`${item.label} (belum tersedia)`} />}
                        </span>
                      ) : (
                        <Link
                          route={item.route as NavRoute}
                          className={rowClass}
                          onClick={closeMobileSidebar}
                          aria-current={active ? 'page' : undefined}
                        >
                          {Icon && (
                            <Icon size={iconSize} className={iconClass} aria-hidden="true" />
                          )}
                          {!collapsed && <span className="truncate">{item.label}</span>}
                          {collapsed && <RailTip label={item.label} />}
                        </Link>
                      )}

                      {/* Submenu: ms-9, mt-2, item px-3 py-2.5 rounded-lg. */}
                      {hasChildren && !collapsed && open && (
                        <ul className="ms-9 mt-2 space-y-1">
                          {item.children?.map((child) => {
                            const childIsActive = Boolean(
                              child.route && isCurrent(url, hrefOf(child.route))
                            )
                            const childClass = cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                              childIsActive
                                ? 'bg-primary-soft text-primary-ink'
                                : 'text-foreground/80 hover:bg-muted',
                              child.disabled && 'cursor-not-allowed opacity-50'
                            )

                            return (
                              <li key={child.label}>
                                {child.route && !child.disabled ? (
                                  <Link
                                    route={child.route as NavRoute}
                                    className={childClass}
                                    onClick={closeMobileSidebar}
                                    aria-current={childIsActive ? 'page' : undefined}
                                  >
                                    {child.label}
                                  </Link>
                                ) : (
                                  <span className={childClass} aria-disabled="true">
                                    {child.label}
                                  </span>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>

              {menu.length === 0 && !collapsed && (
                <p className="px-3 text-xs leading-relaxed text-muted-foreground">
                  Belum ada menu untuk peran ini.
                </p>
              )}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}

/** Label kecil yang muncul saat sidebar menciut menjadi rail. */
function RailTip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-full z-50 ml-2 hidden rounded-md bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background group-hover:block">
      {label}
    </span>
  )
}
