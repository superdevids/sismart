import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const brand = usePage().props.brand
  return (
    <>
      <div className="auth">
        <div className="auth__form-col">
          <Logo size={28} />
          <div className="auth__form-wrap">{children}</div>
          <div style={{ height: 20 }} />
        </div>

        <aside className="auth__aside">
          <div className="auth__aside-top">
            <ThemeToggle />
          </div>

          <p className="auth__quote">
            Satu kode untuk masuk. Satu tempat untuk seluruh urusan sekolah.
          </p>

          <div>
            <div className="pitch__t">{brand?.name ?? 'SMKN 1 Indonesia'}</div>
            <p className="pitch__p">
              Nilai, absensi, jadwal, dan tagihan SPP siswa — dalam satu aplikasi yang rapi dan
              mudah dipakai.
            </p>
          </div>
        </aside>
      </div>
      <FlashToasts />
    </>
  )
}
