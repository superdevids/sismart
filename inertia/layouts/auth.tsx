import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'

/**
 * Foto latar halaman masuk.
 *
 * Aset: "Summer empty classroom, blackboard and flowers on tables, 2023"
 * oleh AKA MBG — Wikimedia Commons, lisensi CC0 (domain publik).
 * Disimpan lokal di `public/images/` supaya halaman tetap utuh walau
 * jaringan sekolah tidak tersedia.
 */
const BACKGROUND_IMAGE = '/images/auth-background.jpg'

/**
 * Layout halaman masuk: satu layar penuh, tanpa gulir.
 *
 * Kartu berada di tengah. Foto latar ditutup lapisan warna token dengan
 * opasitas tinggi agar tampilan tetap lembut dan terbaca di mode terang
 * maupun gelap. `overflow-y-auto` pada kartu hanya menjadi jaring pengaman
 * bila tinggi layar benar-benar kecil — halaman itu sendiri tidak menggulir.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const brand = usePage().props.brand
  const brandName = brand?.name ?? 'SMKN 1 Indonesia'
  const accreditation = brand?.accreditation ?? 'Terakreditasi A'

  return (
    <div className="relative isolate flex h-dvh flex-col overflow-hidden bg-background px-4 py-6 xl:px-8">
      {/* Foto latar + lapisan warna token */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img src={BACKGROUND_IMAGE} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-background/75 dark:bg-background/85" />
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-1 items-center">
        <div className="max-h-full w-full animate-fade overflow-y-auto rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-lg shadow-foreground/5 xl:p-8">
          <header className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Logo size={30} />
                <div className="flex flex-col">
                  <span className="text-base font-semibold leading-tight text-foreground">
                    {brandName}
                  </span>
                  <span className="text-sm text-muted-foreground">{accreditation}</span>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </header>

          <div className="mt-6">{children}</div>
        </div>
      </div>

      <FlashToasts />
    </div>
  )
}
