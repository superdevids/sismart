import type { ReactNode } from 'react'
import AppHeader from '~/components/app_header'
import AppSidebar from '~/components/app_sidebar'
import FlashToasts from '~/components/flash_toasts'
import { useSidebar } from '~/hooks/use_sidebar'
import { cn } from '~/lib/utils'

/**
 * Kerangka aplikasi bergaya TailAdmin: sidebar tetap di kiri (melebar atau
 * menjadi rail), header lengket di atas konten, dan overlay pada layar kecil.
 *
 * `title` hanya ditampilkan pada header; halaman tetap bertanggung jawab atas
 * isinya sendiri lewat komponen `Page`.
 */
export default function AppLayout({ children, title }: { children: ReactNode; title?: string }) {
  const sidebar = useSidebar()

  // Laci mobile ditutup saat pengguna mengklik tautan mana pun di dalam
  // sidebar. Ditangani di event handler, bukan di dalam effect, agar tidak
  // memicu setState bertingkat saat render.
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AppSidebar {...sidebar} />

      {sidebar.isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-[1px] lg:hidden"
          onClick={sidebar.closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          'flex min-h-dvh flex-col transition-[padding] duration-300 ease-in-out',
          sidebar.isMobile ? 'pl-0' : sidebar.showLabels ? 'pl-[290px]' : 'pl-[90px]'
        )}
      >
        <AppHeader
          title={title}
          isMobile={sidebar.isMobile}
          isExpanded={sidebar.isExpanded}
          onToggleSidebar={sidebar.toggleSidebar}
          onOpenMobileSidebar={sidebar.toggleMobileSidebar}
        />

        <main className="flex-1">{children}</main>
      </div>

      <FlashToasts />
    </div>
  )
}
