import Logo from '~/components/logo'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { House, LogOut, Menu, X } from 'lucide-react'
import { Form } from '@adonisjs/inertia/react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'
import NavLink, { type NavItem } from '~/components/nav_link'

/**
 * Top-level app navigation. Add an entry here for every new area of your
 * app, and it shows up in the navigation bar with its active state handled.
 */
const nav: NavItem[] = [{ label: 'Dashboard', route: 'dashboard', icon: House }]

const MENU_ID = 'app-mobile-menu'

/** Row style for a nav entry inside the mobile drawer. */
const mobileItem =
  "flex items-center gap-3 rounded-[var(--r)] px-3 py-3 text-[15px] font-medium text-muted transition-colors hover:bg-paper hover:text-ink [&[aria-current='page']]:bg-paper [&[aria-current='page']]:text-ink"

export default function AppLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)

  // While the mobile menu is open: Escape and any click outside of it close it
  // and hand focus back to the toggle so keyboard users are not stranded.
  useEffect(() => {
    if (!menuOpen) return

    const close = () => {
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (menuPanelRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return
      close()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  return (
    <>
      <header className="header header--bar relative">
        <div className="header__inner px-4 md:px-[30px]">
          <Logo size={28} />

          <div className="header__right">
            <ThemeToggle />

            {/* Desktop: labelled logout, exactly as before. */}
            <div className="hidden md:block">
              <Form route="session.destroy">
                <button type="submit" className="btn btn--secondary btn--sm">
                  <LogOut size={15} /> Keluar
                </button>
              </Form>
            </div>

            {/* Mobile: logout collapses to an icon next to the menu toggle. */}
            <div className="md:hidden">
              <Form route="session.destroy">
                <button type="submit" className="iconbtn" aria-label="Keluar" title="Keluar">
                  <LogOut size={16} />
                </button>
              </Form>
            </div>

            <button
              ref={menuButtonRef}
              type="button"
              className="iconbtn md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
              aria-controls={MENU_ID}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel: kept mounted so it can slide open/closed; when
            closed it is `invisible` (out of the a11y tree and non-focusable). */}
        <div
          id={MENU_ID}
          ref={menuPanelRef}
          className={`absolute inset-x-0 top-full z-40 origin-top border-b border-[var(--line)] bg-card shadow-lg transition-all duration-150 ease-out motion-reduce:transition-none md:hidden ${
            menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
          }`}
        >
          <nav
            aria-label="Menu aplikasi"
            className="flex flex-col gap-1 p-2"
            onClick={() => setMenuOpen(false)}
          >
            {nav.map(({ label, route, icon: Icon }) => (
              <NavLink key={label} route={route} className={mobileItem}>
                {Icon && <Icon size={18} />}
                {label}
              </NavLink>
            ))}
            <Form route="session.destroy">
              <button type="submit" className="btn btn--secondary btn--sm btn--block mt-1">
                <LogOut size={15} /> Keluar
              </button>
            </Form>
          </nav>
        </div>
      </header>

      <nav className="subnav hidden md:flex">
        <div className="subnav__inner">
          {nav.map(({ label, route, icon: Icon }) => (
            <NavLink key={label} route={route} className="subnav__item">
              {Icon && <Icon size={14} />}
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="app-main min-h-[calc(100vh-60px)] md:min-h-[calc(100vh-108px)]">
        {children}
      </div>
      <FlashToasts />
    </>
  )
}
