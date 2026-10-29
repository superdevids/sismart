import { useState } from 'react'
import AuthLayout from '~/layouts/auth'
import { Form } from '@adonisjs/inertia/react'
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <div className="mb-7 flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Masuk ke akun Anda</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Gunakan ID Pengguna yang diberikan sekolah. Huruf besar dan kecil tidak dibedakan.
        </p>
      </div>

      <Form route="session.store">
        {({ errors, processing }) => (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="loginCode" className="text-[13px] font-medium">
                <KeyRound className="size-3.5 text-primary" aria-hidden="true" />
                ID Pengguna
              </Label>

              <Input
                id="loginCode"
                name="loginCode"
                type="text"
                autoComplete="username"
                autoCapitalize="characters"
                inputMode="text"
                spellCheck={false}
                placeholder="Contoh: S2026001"
                autoFocus
                aria-invalid={errors.loginCode ? 'true' : 'false'}
                aria-describedby={errors.loginCode ? 'loginCode-error' : undefined}
                className={cn(
                  'h-11 rounded-lg font-mono text-base font-semibold uppercase tracking-[0.08em] shadow-xs transition-shadow',
                  'focus-visible:shadow-sm',
                  'placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground/70',
                  errors.loginCode && 'border-destructive focus-visible:ring-destructive/30'
                )}
              />

              {errors.loginCode && (
                <p
                  id="loginCode-error"
                  role="alert"
                  className="flex items-start gap-1.5 text-sm font-medium text-destructive"
                >
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.loginCode}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor="password" className="text-[13px] font-medium">
                  <LockKeyhole className="size-3.5 text-primary" aria-hidden="true" />
                  Password
                </Label>
                <span className="text-[11px] text-muted-foreground">Tanpa spasi di awal/akhir</span>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  spellCheck={false}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={cn(
                    'h-11 rounded-lg pr-12 text-base shadow-xs transition-shadow',
                    'focus-visible:shadow-sm',
                    errors.password && 'border-destructive focus-visible:ring-destructive/30'
                  )}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  aria-pressed={showPassword}
                  className="absolute right-1.5 top-1/2 inline-grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {errors.password ? (
                <p
                  id="password-error"
                  role="alert"
                  className="flex items-start gap-1.5 text-sm font-medium text-destructive"
                >
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  <span>{errors.password}</span>
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={processing}
              className="group h-11 w-full rounded-lg text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99]"
            >
              {processing ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              )}
              {processing ? 'Memeriksa…' : 'Masuk'}
            </Button>
          </div>
        )}
      </Form>

      <div className="mt-7 flex flex-col gap-2.5">
        <div className="flex items-start gap-2 rounded-lg bg-info-soft px-3 py-2.5">
          <Info className="mt-0.5 size-3.5 shrink-0 text-info" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-foreground/85">
            Lupa password? Hubungi administrator sekolah. Password tidak dapat direset sendiri dan
            tidak dikirim lewat pesan.
          </p>
        </div>

        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
          <span>
            ID Pengguna dan password bersifat rahasia. Jangan bagikan kepada siapa pun, termasuk
            yang mengaku panitia atau tata usaha.
          </span>
        </p>
      </div>
    </>
  )
}

Signin.layout = [AuthLayout]
