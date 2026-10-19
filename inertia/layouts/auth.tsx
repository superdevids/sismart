import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="auth">
        <aside
          className="auth__aside"
          style={{ borderLeft: 'none', borderRight: '1px solid var(--line)' }}
        >
          <div className="auth__aside-top">
            <ThemeToggle />
          </div>

          <p className="auth__quote">
            Satu pintu untuk administrasi sekolah: kehadiran, pembayaran, dan kegiatan belajar.
          </p>
        </aside>

        <div className="auth__form-col">
          <Logo size={28} />
          <div className="auth__form-wrap">{children}</div>
          <div style={{ height: 20 }} />
        </div>
      </div>
      <FlashToasts />
    </>
  )
}
