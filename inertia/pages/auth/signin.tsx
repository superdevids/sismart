import { useState } from 'react'
import AuthLayout from '~/layouts/auth'
import { Form } from '@adonisjs/inertia/react'
import {
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  LogIn,
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
      <div className="mb-6">
        <h1 className="text-2xl text-center font-bold tracking-tight text-foreground">Masuk</h1>
      </div>

      <Form route="session.store">
        {({ errors, processing }) => (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="loginCode">
                <KeyRound className="size-3.5 text-muted-foreground" />
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
                placeholder="Huruf besar/kecil tidak dibedakan."
                autoFocus
                aria-invalid={errors.loginCode ? 'true' : 'false'}
                aria-describedby={errors.loginCode ? 'loginCode-error' : undefined}
                className={cn(
                  'h-11 rounded-lg font-mono text-base font-semibold uppercase tracking-widest',
                  'placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:normal-case placeholder:tracking-normal'
                )}
              />

              {errors.loginCode && (
                <p
                  id="loginCode-error"
                  role="alert"
                  className="flex items-start gap-1.5 text-sm font-medium text-foreground"
                >
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                  <span>{errors.loginCode}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">
                <LockKeyhole className="size-3.5 text-muted-foreground" />
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  spellCheck={false}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className="h-11 rounded-lg pr-12 text-base"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  aria-pressed={showPassword}
                  className="absolute right-1.5 top-1/2 inline-grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {errors.password ? (
                <p
                  id="password-error"
                  role="alert"
                  className="flex items-start gap-1.5 text-sm font-medium text-foreground"
                >
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                  <span>{errors.password}</span>
                </p>
              ) : null}
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

      <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
        <span>
          ID Pengguna dan password bersifat rahasia. Jangan bagikan kepada siapa pun, termasuk yang
          mengaku panitia atau tata usaha.
        </span>
      </p>
    </>
  )
}

Signin.layout = [AuthLayout]
