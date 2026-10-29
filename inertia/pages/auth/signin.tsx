import AuthLayout from '~/layouts/auth'
import { Form } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react'

/**
 * Halaman masuk Sismart di `/auth/signin`.
 *
 * Setiap pengguna — siswa, orang tua, guru, staff, kepala sekolah, admin —
 * masuk dengan satu kode unik. Tidak ada login email/password.
 */
export default function Signin() {
  const brand = usePage().props.brand
  const brandName = brand?.name ?? 'SMKN 1 Indonesia'

  return (
    <div className="animate-fade">
      <header>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          <KeyRound size={13} strokeWidth={2} />
          Akses kode unik
        </span>

        <h1 className="mt-3.5 text-[26px] font-bold leading-tight tracking-tight text-foreground sm:text-[30px]">
          Masuk ke Sismart
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          Gunakan kode unik dari administrator{' '}
          <strong className="font-semibold text-foreground">{brandName}</strong>.
        </p>
      </header>

      <Form route="session.store">
        {({ errors, processing }) => (
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="loginCode" className="text-[13px] font-medium text-foreground">
                Kode masuk
              </label>
              <input
                id="loginCode"
                name="loginCode"
                type="text"
                autoComplete="username"
                autoCapitalize="characters"
                inputMode="text"
                spellCheck={false}
                placeholder="S2026001"
                autoFocus
                aria-invalid={errors.loginCode ? 'true' : 'false'}
                aria-describedby={errors.loginCode ? 'loginCode-error' : 'loginCode-help'}
                className={[
                  'h-13 w-full rounded-xl border bg-background px-4',
                  'font-mono text-lg font-semibold uppercase tracking-[0.14em] text-foreground',
                  'placeholder:font-sans placeholder:text-[15px] placeholder:font-normal',
                  'placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground',
                  'transition-[border-color,box-shadow,background-color] outline-none',
                  'focus:bg-card focus:ring-[4px]',
                  errors.loginCode
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-input focus:border-primary focus:ring-primary/20',
                ].join(' ')}
              />

              {errors.loginCode ? (
                <span
                  id="loginCode-error"
                  role="alert"
                  className="text-[12.5px] font-medium text-destructive"
                >
                  {errors.loginCode}
                </span>
              ) : (
                <span
                  id="loginCode-help"
                  className="text-[12.5px] leading-relaxed text-muted-foreground"
                >
                  Kode dibagikan oleh administrator sekolah. Hubungi tata usaha bila kode hilang.
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={processing}
              aria-busy={processing}
              className="group flex h-12.5 w-full items-center justify-between gap-2.5 rounded-xl bg-primary pl-5 pr-2.5 text-[15px] font-semibold text-primary-foreground transition-[background-color,scale,opacity] hover:bg-primary/90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-65"
            >
              <span>{processing ? 'Memeriksa…' : 'Masuk'}</span>
              <span
                aria-hidden="true"
                className="grid size-7.5 place-items-center rounded-md bg-primary-foreground/15 transition-transform group-hover:translate-x-0.5"
              >
                <ArrowRight size={16} strokeWidth={2} />
              </span>
            </button>
          </div>
        )}
      </Form>

      <p className="mt-4.5 flex items-center gap-2 text-[12.5px] text-muted-foreground">
        <ShieldCheck size={15} strokeWidth={1.8} className="shrink-0 text-success" />
        <span>Sesi aman. Kode Anda tidak dibagikan ke siapa pun.</span>
      </p>

      <p className="mt-5.5 border-t border-border pt-4.5 text-[13px] leading-relaxed text-muted-foreground">
        Belum punya kode? Hubungi administrator sekolah untuk mendapatkannya.
      </p>
    </div>
  )
}

Signin.layout = [AuthLayout]
