import AuthLayout from '~/layouts/auth'
import { Form } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { AlertCircle, KeyRound, LoaderCircle, LogIn, ShieldCheck } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

/**
 * Halaman masuk Sismart di `/auth/signin`.
 *
 * Setiap pengguna — siswa, orang tua, guru, staff, kepala sekolah, admin —
 * masuk dengan satu kode unik. Tidak ada login email/password.
 */
export default function Signin() {
  const brand = usePage().props.brand

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Masuk ke Sismart</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Satu kode untuk seluruh urusan {brand?.institutionType?.toLowerCase() ?? 'sekolah'}.
        </p>
      </div>

      <Form route="session.store">
        {({ errors, processing }) => (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="loginCode">
                <KeyRound className="size-3.5 text-muted-foreground" />
                Kode masuk
              </Label>

              <Input
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
                className={cn(
                  // Kode masuk adalah identifier teknis (bukan prosa), jadi
                  // monospace diizinkan oleh DESIGN-SYSTEM.md §2. Placeholder
                  // tetap memakai font teks karena berisi contoh, bukan kode nyata.
                  'h-11 rounded-lg font-mono text-base font-semibold uppercase tracking-widest',
                  'placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:normal-case placeholder:tracking-normal'
                )}
              />

              {errors.loginCode ? (
                <p
                  id="loginCode-error"
                  role="alert"
                  className="flex items-start gap-1.5 text-sm font-medium text-foreground"
                >
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                  <span>{errors.loginCode}</span>
                </p>
              ) : (
                <p id="loginCode-help" className="text-xs leading-relaxed text-muted-foreground">
                  Huruf besar/kecil tidak dibedakan. Hubungi tata usaha bila kode hilang.
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={processing}
              className="group h-11 w-full rounded-lg font-semibold hover:-translate-y-0.5 active:translate-y-0"
            >
              {processing ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <LogIn className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              )}
              {processing ? 'Memeriksa…' : 'Masuk'}
            </Button>
          </div>
        )}
      </Form>

      <p className="mt-6 flex items-center gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
        <span>
          Kode ini bersifat rahasia dan hanya terhubung ke satu akun. Jangan bagikan kepada siapa
          pun.
        </span>
      </p>
    </>
  )
}

Signin.layout = [AuthLayout]
