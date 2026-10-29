import { usePage } from '@inertiajs/react'
import { Menu, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
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

/**
 * Header mengikuti TailAdmin: tombol toggle, kotak pencarian di tengah,
 * lalu tombol tema dan identitas pengguna di kanan.
 */
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
  const searchRef = useRef<HTMLInputElement>(null)

  // Ctrl/Cmd+K memfokuskan pencarian, seperti referensi.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between gap-4 border-b border-border bg-card px-4 py-4 xl:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={isMobile ? onOpenMobileSidebar : onToggleSidebar}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground xl:size-11"
          aria-label={isMobile ? 'Buka menu' : isExpanded ? 'Ciutkan menu' : 'Lebarkan menu'}
        >
          {isMobile ? (
            <Menu className="size-5" />
          ) : isExpanded ? (
            <PanelLeftClose className="size-5" />
          ) : (
            <PanelLeftOpen className="size-5" />
          )}
        </button>

        {/* Pencarian: tersembunyi di layar kecil, sama seperti referensi. */}
        <div className="relative hidden w-full max-w-md lg:block">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            ref={searchRef}
            type="search"
            placeholder={title ? `Cari di ${title}…` : 'Cari…'}
            aria-label="Pencarian"
            className="h-11 w-full rounded-lg border border-border bg-transparent pr-16 pl-11 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {actions}
        <ThemeToggle />

        <div className="hidden items-center gap-3 border-l border-border pl-3 sm:flex">
          <span
            className="grid size-9 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-ink"
            aria-hidden="true"
          >
            {initialsOf(name)}
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block max-w-[12rem] truncate text-sm font-medium text-foreground">
              {name}
            </span>
            {roleLabel && <span className="block text-xs text-muted-foreground">{roleLabel}</span>}
          </span>
        </div>

        <form method="post" action="/logout">
          <button
            type="submit"
            className="h-10 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Keluar
          </button>
        </form>
      </div>
    </header>
  )
}
