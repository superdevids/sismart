import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'
import AuthBackgroundShape from '~/components/auth_background_shape'

/**
 * Layout halaman masuk (pola AdminCN): kartu terpusat di atas latar
 * dekoratif. Seluruh warna mengikuti token design system.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  const brand = usePage().props.brand
  const brandName = brand?.name ?? 'SMKN 1 Indonesia'
  const institutionType = brand?.institutionType ?? 'Sekolah'
  const tagline = brand?.tagline ?? 'Sistem informasi sekolah'

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-background px-4 py-8 xl:px-8">
      {/* Latar dekoratif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
      >
        <AuthBackgroundShape className="h-auto w-[686px] max-w-none" />
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-1 items-center">
        <div className="w-full animate-fade rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-lg shadow-foreground/5 xl:p-8">
          <header className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Logo size={30} />
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold leading-tight text-foreground">
                    {brandName}
                  </span>
                  <span className="text-[11.5px] text-muted-foreground">{institutionType}</span>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </header>

          <div className="mt-6">{children}</div>
        </div>
      </div>

      <footer className="mx-auto mt-6 flex w-full max-w-lg flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span>
          © {new Date().getFullYear()} {brandName}
        </span>
        <span aria-hidden="true" className="size-[3px] rounded-full bg-current opacity-60" />
        <span>{tagline}</span>
      </footer>

      <FlashToasts />
    </div>
  )
}
