import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import Logo from '~/components/logo'
import ThemeToggle from '~/components/theme_toggle'
import { LANDING } from '~/content/landing'
import { focusRing } from './ui'

/**
 * Header publik: logo, navigasi antar halaman, tombol tema, dan tombol
 * masuk/dashboard. Mobile-first: navigasi penuh disembunyikan di bawah `md`
 * dan digantikan tombol hamburger yang membuka panel menu.
 *
 * Aksesibilitas menu: tombol memakai `aria-expanded`/`aria-controls` dengan
 * `aria-label`, panel tertutup saat tombol Escape ditekan atau tautan dipilih.
 */
export default function SiteHeader() {
  const { props } = usePage()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const isLoggedIn = Boolean(props.user)
  const closeMenu = () => setOpen(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-8">
        <Logo size={28} />

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {LANDING.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-[13.5px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)] ${focusRing}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__right">
          <ThemeToggle />
          {isLoggedIn ? (
            <Link
              route="dashboard"
              className={`btn btn--sm bg-brand-blue text-white hover:opacity-90 hidden md:inline-flex ${focusRing}`}
            >
              {LANDING.actions.dashboard}
            </Link>
          ) : (
            <Link
              route="session.create"
              className={`btn btn--sm bg-brand-blue text-white hover:opacity-90 hidden md:inline-flex ${focusRing}`}
              title={LANDING.actions.loginNote}
            >
              {LANDING.actions.login}
            </Link>
          )}
          <button
            type="button"
            className={`inline-grid h-9 w-9 place-items-center rounded-[var(--r)] border border-[var(--line)] text-[var(--ink)] transition-colors hover:border-[var(--line-2)] md:hidden ${focusRing}`}
            aria-expanded={open}
            aria-controls="menu-publik"
            aria-label={open ? LANDING.actions.closeMenu : LANDING.actions.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-publik" aria-label="Navigasi mobile" className="md:hidden">
          <div className="mx-auto w-full max-w-[1120px] px-5 pb-4 sm:px-6">
            <ul className="flex flex-col rounded-[var(--r-lg)] border border-[var(--line-2)] bg-[var(--card)] p-2 shadow-lg">
              {LANDING.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={`block rounded-[var(--r)] px-3 py-2.5 text-[14.5px] font-medium text-[var(--ink-2)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)] ${focusRing}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-1 border-t border-[var(--line)] pt-2">
                {isLoggedIn ? (
                  <Link
                    route="dashboard"
                    onClick={closeMenu}
                    className={`btn btn--block bg-brand-blue text-white hover:opacity-90 ${focusRing}`}
                  >
                    {LANDING.actions.dashboard}
                  </Link>
                ) : (
                  <Link
                    route="session.create"
                    onClick={closeMenu}
                    className={`btn btn--block bg-brand-blue text-white hover:opacity-90 ${focusRing}`}
                    title={LANDING.actions.loginNote}
                  >
                    {LANDING.actions.login}
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </nav>
      )}
    </header>
  )
}
