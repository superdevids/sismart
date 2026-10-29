import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import { BadgeCheck, CalendarCheck2, GraduationCap, ShieldCheck } from 'lucide-react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'

const BACKGROUND_IMAGE = '/images/auth-background.jpg'

const HIGHLIGHTS = [
  { icon: GraduationCap, label: 'Data siswa & akademik', hint: 'Nilai, kehadiran, jadwal' },
  { icon: CalendarCheck2, label: 'Administrasi terpadu', hint: 'SPP, surat, inventaris' },
  { icon: ShieldCheck, label: 'Akses sesuai peran', hint: 'Enam peran, izin terpisah' },
]

export default function AuthLayout({ children }: { children: ReactNode }) {
  const brand = usePage().props.brand
  const brandName = brand?.name ?? 'SMKN 1 Indonesia'
  const accreditation = brand?.accreditation ?? 'Terakreditasi A'
  const institutionType = brand?.institutionType ?? 'Sekolah'
  const tagline = brand?.tagline ?? 'Sistem informasi sekolah'

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Panel brand: hanya tampil di layar lebar */}
      <aside className="relative hidden w-1/2 shrink-0 overflow-hidden xl:flex xl:flex-col xl:justify-between">
        <img
          src={BACKGROUND_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        {/* Lapisan warna agar teks tetap terbaca di atas foto apa pun.
            Biru digelapkan ke #1d4ed8 agar teks 80% opasitas tetap lolos WCAG AA (4.65:1). */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8]/95 via-[#16418f]/92 to-[#0f172a]/90"
        />
        <div
          aria-hidden="true"
          className="surface-grid absolute inset-0 opacity-[0.14] mix-blend-overlay"
        />

        <div className="relative z-10 flex flex-col gap-1 p-10 text-primary-foreground">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-primary-foreground/12 ring-1 ring-primary-foreground/25">
              <Logo size={26} />
            </span>
            <div className="flex flex-col">
              <span className="text-base font-semibold leading-tight">{brandName}</span>
              <span className="text-xs text-primary-foreground/75">{institutionType}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8 px-10 pb-4">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-foreground/12 px-3 py-1 text-xs font-medium text-primary-foreground ring-1 ring-primary-foreground/20">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              {accreditation}
            </span>
            <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight text-balance">
              {tagline}
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/80">
              Satu tempat untuk akademik, administrasi, dan komunikasi sekolah.
            </p>
          </div>

          <ul className="flex flex-col gap-2.5">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon
              return (
                <li
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl bg-primary-foreground/8 px-3.5 py-2.5 ring-1 ring-primary-foreground/12"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-foreground/15">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="truncate text-xs text-primary-foreground/70">{item.hint}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="relative z-10 px-10 pb-10 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} {brandName}
        </div>
      </aside>

      {/* Panel form */}
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-2.5 xl:invisible">
            <Logo size={26} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight text-foreground">
                {brandName}
              </span>
              <span className="text-xs text-muted-foreground">{accreditation}</span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-10 sm:px-8">
          <div className="w-full max-w-sm animate-rise">{children}</div>
        </div>

        <div className="px-5 pb-6 sm:px-8">
          <p className="mx-auto max-w-sm text-center text-xs leading-relaxed text-muted-foreground">
            Dengan masuk, Anda menyetujui bahwa data sekolah bersifat rahasia dan hanya digunakan
            untuk keperluan internal.
          </p>
        </div>
      </main>

      <FlashToasts />
    </div>
  )
}
