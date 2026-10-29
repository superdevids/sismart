import type { ReactNode } from 'react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'

/**
 * Kerangka minimal untuk halaman dalam yang belum punya navigasi (mis. data
 * pengguna). Hanya bar atas tipis berisi tombol tema dan tombol keluar, tanpa
 * sidebar. Akan digantikan kerangka aplikasi saat modul navigasi dibangun.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <a href="/panel" className="text-sm font-semibold tracking-tight">
            Sismart
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form method="post" action="/logout">
              <button
                type="submit"
                className="h-9 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>

      <FlashToasts />
    </div>
  )
}
