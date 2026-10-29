import Page from '~/components/page'
import { type ReactNode } from 'react'
import NavLink, { type NavItem } from '~/components/nav_link'

const items: NavItem[] = []

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <Page title="Pengaturan" description="Kelola akun dan preferensi Anda.">
      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Pengaturan" className="flex gap-1 md:flex-col">
          {items.map(({ label, route, icon: Icon }) => (
            <NavLink
              key={label}
              route={route}
              exact
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeClassName="bg-muted text-foreground"
            >
              {Icon && <Icon size={16} strokeWidth={1.8} />}
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          {children}
        </div>
      </div>
    </Page>
  )
}
