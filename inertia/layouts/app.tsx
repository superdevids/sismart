import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import { House, LogOut } from 'lucide-react'
import { Form } from '@adonisjs/inertia/react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'
import NavLink, { type NavItem } from '~/components/nav_link'

/**
 * Navigasi aplikasi tingkat atas. Tambahkan entri di sini untuk setiap area
 * baru aplikasi, dan entri tersebut muncul di bilah navigasi dengan status
 * aktif yang sudah ditangani.
 */
const nav: NavItem[] = [{ label: 'Dashboard', route: 'dashboard', icon: House }]

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo size={26} />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Form route="session.destroy">
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <LogOut size={15} strokeWidth={1.8} />
                Keluar
              </button>
            </Form>
          </div>
        </div>

        <nav className="border-t border-border/60">
          <div className="mx-auto flex h-12 w-full max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
            {nav.map(({ label, route, icon: Icon }) => (
              <NavLink
                key={label}
                route={route}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeClassName="bg-muted text-foreground"
              >
                {Icon && <Icon size={14} strokeWidth={1.8} />}
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>
      <FlashToasts />
    </div>
  )
}
