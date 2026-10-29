import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import { House, LogOut, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { Form } from '@adonisjs/inertia/react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import NavLink, { type NavItem } from '~/components/nav_link'

export type NavGroup = {
  /** Label grup; boleh kosong untuk grup pertama tanpa judul. */
  label?: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Akademik',
    items: [{ label: 'Dasbor', route: 'dashboard', icon: House }],
  },
]

/**
 * Sidebar shell admin (pola AdminCN). Di layar < lg sidebar menjadi panel
 * geser yang dikendalikan tombol di header.
 */
export default function AppSidebar({
  groups = NAV_GROUPS,
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: {
  groups?: NavGroup[]
  open: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}) {
  const brand = usePage().props.brand
  const brandName = brand?.name ?? 'SMKN 1 Indonesia'
  const institutionType = brand?.institutionType ?? 'Sekolah'

  return (
    <>
      {/* Latar gelap di mobile */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[2px] transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      <aside
        aria-label="Navigasi utama"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-[width,transform] duration-200',
          'lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0',
          collapsed ? 'lg:w-[72px]' : 'lg:w-[268px]',
          'w-[280px]',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Kepala sidebar */}
        <div className="flex h-14 items-center gap-2 px-4">
          <Logo size={24} />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold leading-tight text-foreground">
                {brandName}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{institutionType}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Tutup menu"
            className="ml-auto lg:hidden"
          >
            <X />
          </Button>
        </div>

        <Separator />

        {/* Daftar menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.label ?? 'utama'} className="mb-5 last:mb-0">
              {group.label && !collapsed && (
                <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <SidebarLink item={item} collapsed={collapsed} onNavigate={onClose} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <Separator />

        {/* Kaki sidebar */}
        <div className="flex flex-col gap-1 p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Lebarkan sidebar' : 'Sempitkan sidebar'}
            className="hidden justify-start gap-2 text-muted-foreground lg:flex"
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            {!collapsed && <span>Perkecil</span>}
          </Button>

          <Form route="session.destroy">
            <button
              type="submit"
              className={cn(
                'inline-flex h-8 w-full items-center gap-2 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                collapsed && 'lg:justify-center lg:px-0'
              )}
            >
              <LogOut className="size-4 shrink-0" />
              {!collapsed && <span>Keluar</span>}
            </button>
          </Form>
        </div>
      </aside>
    </>
  )
}

function SidebarLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  onNavigate: () => void
}) {
  const Icon = item.icon
  return (
    <NavLink
      route={item.route}
      className={cn(
        'flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors',
        'hover:bg-muted hover:text-foreground',
        collapsed && 'lg:justify-center lg:px-0'
      )}
      activeClassName="bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
      onClick={onNavigate}
    >
      {Icon ? <Icon className="size-4 shrink-0" /> : null}
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  )
}

export type { ReactNode }
