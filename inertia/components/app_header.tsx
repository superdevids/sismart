import { usePage } from '@inertiajs/react'
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import type { ReactNode } from 'react'
import ThemeToggle from '~/components/theme_toggle'

const ROLE_LABELS: Record<string, string> = {
  siswa: 'Siswa',
  orang_tua: 'Orang tua',
  guru: 'Guru',
  staff: 'Staff',
  kepsek: 'Kepala sekolah',
  admin: 'Admin',
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export default function AppHeader({
  title,
  isMobile,
  isExpanded,
  onToggleSidebar,
  onOpenMobileSidebar,
  actions,
}: {
  title?: string
  isMobile: boolean
  isExpanded: boolean
  onToggleSidebar: () => void
  onOpenMobileSidebar: () => void
  actions?: ReactNode
}) {
  const { props } = usePage()
  const user = props.user
  const name = user?.fullName ?? 'Pengguna'
  const roleLabel = ROLE_LABELS[user?.role ?? ''] ?? user?.role ?? ''

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/85 px-4 backdrop-blur lg:px-6">
      <button
        type="button"
        onClick={isMobile ? onOpenMobileSidebar : onToggleSidebar}
        className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={isMobile ? 'Buka menu' : isExpanded ? 'Ciutkan menu' : 'Lebarkan menu'}
      >
        {isMobile ? (
          <Menu className="size-4" />
        ) : isExpanded ? (
          <PanelLeftClose className="size-4" />
        ) : (
          <PanelLeftOpen className="size-4" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        {title && (
          <p className="truncate text-sm font-semibold tracking-tight text-foreground">{title}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {actions}
        <ThemeToggle />

        <div className="hidden items-center gap-2.5 border-l border-border pl-3 sm:flex">
          <span
            className="grid size-8 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-ink"
            aria-hidden="true"
          >
            {initialsOf(name)}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block max-w-[12rem] truncate text-xs font-medium text-foreground">
              {name}
            </span>
            {roleLabel && (
              <span className="block text-[11px] text-muted-foreground">{roleLabel}</span>
            )}
          </span>
        </div>

        <form method="post" action="/logout" className="ml-1">
          <button
            type="submit"
            className="h-9 rounded-lg border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Keluar
          </button>
        </form>
      </div>
    </header>
  )
}
