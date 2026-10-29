import AuthLayout from '~/layouts/auth'
import { Form } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { KeyRound, LogIn, ShieldCheck } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'

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
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Masuk ke Sismart</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Satu kode untuk seluruh urusan {brand?.institutionType?.toLowerCase() ?? 'sekolah'}. Kode
          dibagikan oleh administrator{' '}
          <span className="font-medium text-foreground">{brandName}</span>.
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
                  'h-11 rounded-lg font-mono text-base font-semibold uppercase tracking-[0.12em]',
                  'placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:normal-case placeholder:tracking-normal'
                )}
              />

              {errors.loginCode ? (
                <p
                  id="loginCode-error"
                  role="alert"
                  className="text-xs font-medium text-destructive"
                >
                  {errors.loginCode}
                </p>
              ) : (
                <p id="loginCode-help" className="text-xs leading-relaxed text-muted-foreground">
                  Huruf besar/kecil tidak dibedakan. Hubungi tata usaha bila kode hilang.
                </p>
              )}
            </div>

            <Button type="submit" disabled={processing} className="h-10 w-full rounded-lg">
              <LogIn className="size-4" />
              {processing ? 'Memeriksa…' : 'Masuk'}
            </Button>
          </div>
        )}
      </Form>

      <div className="my-5 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">atau</span>
        <Separator className="flex-1" />
      </div>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
        <span>
          Belum punya kode? Hubungi administrator sekolah. Sesi Anda aman dan tidak dibagikan ke
          siapa pun.
        </span>
      </p>
    </>
  )
}

Signin.layout = [AuthLayout]
