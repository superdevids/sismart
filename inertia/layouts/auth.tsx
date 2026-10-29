import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'
import { BookOpenCheck, CalendarDays, Wallet } from 'lucide-react'

/**
 * Layout halaman masuk. Kolom kiri berisi formulir, kolom kanan panel
 * informasi sekolah. Di layar mobile panel kanan disembunyikan.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const brand = usePage().props.brand
  const brandName = brand?.name ?? 'SMKN 1 Indonesia'
  const institutionType = brand?.institutionType ?? 'Sekolah'
  const tagline = brand?.tagline ?? 'Sistem informasi sekolah'

  return (
    <>
      <div className="auth">
        <div className="auth__form-col">
          <div className="auth__brandbar">
            <Logo size={26} />
            <span className="auth__brandname">{brandName}</span>
          </div>

          <div className="auth__form-wrap">{children}</div>

          <footer className="auth__legal">
            <span>
              © {new Date().getFullYear()} {brandName}
            </span>
            <span className="auth__legal-dot" aria-hidden="true" />
            <span>{tagline}</span>
          </footer>
        </div>

        <aside className="auth__aside">
          <div className="auth__aside-top">
            <ThemeToggle />
          </div>

          <div className="auth__aside-body">
            <p className="auth__eyebrow">{institutionType}</p>
            <h2 className="auth__aside-title">
              Satu kode untuk masuk.
              <br />
              Satu tempat untuk seluruh urusan sekolah.
            </h2>

            <ul className="auth__features">
              <li className="auth__feature">
                <span className="auth__feature-icon" aria-hidden="true">
                  <BookOpenCheck size={16} strokeWidth={1.8} />
                </span>
                <div>
                  <strong>Nilai &amp; rapor</strong>
                  <span>Input nilai dan susun rapor per semester.</span>
                </div>
              </li>
              <li className="auth__feature">
                <span className="auth__feature-icon" aria-hidden="true">
                  <CalendarDays size={16} strokeWidth={1.8} />
                </span>
                <div>
                  <strong>Absensi &amp; jadwal</strong>
                  <span>Rekap kehadiran dan jadwal per kelas.</span>
                </div>
              </li>
              <li className="auth__feature">
                <span className="auth__feature-icon" aria-hidden="true">
                  <Wallet size={16} strokeWidth={1.8} />
                </span>
                <div>
                  <strong>SPP &amp; pembayaran</strong>
                  <span>Tagihan, riwayat bayar, dan tunggakan.</span>
                </div>
              </li>
            </ul>
          </div>

          <p className="auth__aside-foot">
            Akses hanya untuk pengguna terdaftar. Kode dibagikan oleh administrator sekolah.
          </p>
        </aside>
      </div>
      <FlashToasts />
    </>
  )
}
