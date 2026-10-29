import AuthLayout from '~/layouts/auth'
import { Form } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'

/**
 * Sismart sign-in page at `/auth/signin`.
 *
 * Every user — siswa, orang tua, guru, staff, kepala sekolah, admin — signs in
 * with a unique login code. There is no email/password login.
 */
export default function Signin() {
  const brand = usePage().props.brand
  const brandName = brand?.name ?? 'SMKN 1 Indonesia'
  return (
    <>
      <h1 className="auth__title">Masuk ke Sismart</h1>
      <p className="auth__sub">Gunakan kode unik yang diberikan {brandName}.</p>

      <Form route="session.store">
        {({ errors, processing }) => (
          <div className="auth__form">
            <div className="field">
              <label className="field__label" htmlFor="loginCode">
                Kode masuk
              </label>
              <input
                id="loginCode"
                name="loginCode"
                type="text"
                className="field__input mono"
                autoComplete="username"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="Contoh: S2026001"
                aria-invalid={errors.loginCode ? 'true' : 'false'}
                aria-describedby="loginCode-help"
                autoFocus
              />
              {errors.loginCode ? (
                <span className="field__error">{errors.loginCode}</span>
              ) : (
                <span id="loginCode-help" className="field__hint">
                  Kode dibagikan oleh administrator sekolah. Hubungi tata usaha bila kode hilang.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={processing}
              style={{ marginTop: 4 }}
            >
              {processing ? 'Memeriksa…' : 'Masuk'}
            </button>
          </div>
        )}
      </Form>

      <p className="auth__foot">
        Belum punya kode? Hubungi administrator sekolah untuk mendapatkannya.
      </p>
    </>
  )
}

Signin.layout = [AuthLayout]
