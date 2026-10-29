import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'
import { BookOpenCheck, CalendarDays, Wallet } from 'lucide-react'

const FEATURES = [
  {
    icon: BookOpenCheck,
    title: 'Nilai & rapor',
    body: 'Input nilai dan susun rapor per semester.',
  },
  {
    icon: CalendarDays,
    title: 'Absensi & jadwal',
    body: 'Rekap kehadiran dan jadwal per kelas.',
  },
  {
    icon: Wallet,
    title: 'SPP & pembayaran',
    body: 'Tagihan, riwayat bayar, dan tunggakan.',
  },
]

/**
 * Layout halaman masuk: formulir di kolom kiri, panel informasi sekolah di
 * kolom kanan. Panel kanan disembunyikan di layar kecil.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const brand = usePage().props.brand
  const brandName = brand?.name ?? 'SMKN 1 Indonesia'
  const institutionType = brand?.institutionType ?? 'Sekolah'
  const tagline = brand?.tagline ?? 'Sistem informasi sekolah'

  return (
    <div className="grid min-h-dvh bg-card lg:grid-cols-[1.04fr_1fr]">
      {/* Kolom formulir */}
      <div className="flex flex-col px-5 py-6 sm:px-9 lg:px-10">
        <div className="flex items-center gap-2.5">
          <Logo size={26} />
          <span className="text-[14.5px] font-semibold tracking-tight text-foreground">
            {brandName}
          </span>
        </div>

        <div className="m-auto w-full max-w-sm py-6 sm:max-w-[344px]">{children}</div>

        <footer className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} {brandName}
          </span>
          <span aria-hidden="true" className="size-[3px] rounded-full bg-current opacity-60" />
          <span>{tagline}</span>
        </footer>
      </div>

      {/* Panel informasi — hanya desktop */}
      <aside className="relative hidden overflow-hidden border-l border-border bg-background px-11 py-11 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_78%_18%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_70%)] opacity-70"
        />

        <div className="relative flex justify-end">
          <ThemeToggle />
        </div>

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            {institutionType}
          </p>
          <h2 className="mt-3 text-[clamp(22px,2.2vw,30px)] font-bold leading-[1.18] tracking-tight text-foreground">
            Satu kode untuk masuk.
            <br />
            Satu tempat untuk seluruh urusan sekolah.
          </h2>

          <ul className="mt-7 flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary">
                  <Icon size={16} strokeWidth={1.8} />
                </span>
                <div>
                  <strong className="block text-sm font-semibold tracking-tight text-foreground">
                    {title}
                  </strong>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-muted-foreground">
                    {body}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative max-w-[40ch] text-[12.5px] leading-relaxed text-muted-foreground">
          Akses hanya untuk pengguna terdaftar. Kode dibagikan oleh administrator sekolah.
        </p>
      </aside>

      <FlashToasts />
    </div>
  )
}
