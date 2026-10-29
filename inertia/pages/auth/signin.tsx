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
    <div className="signin">
      <header className="signin__head">
        <span className="signin__badge">
          <KeyRound size={14} strokeWidth={1.8} />
          Akses kode unik
        </span>
        <h1 className="signin__title">Masuk ke Sismart</h1>
        <p className="signin__sub">
          Gunakan kode unik dari administrator <strong>{brandName}</strong>.
        </p>
      </header>

      <Form route="session.store">
        {({ errors, processing }) => (
          <div className="signin__form">
            <div className="signin__field">
              <label className="signin__label" htmlFor="loginCode">
                Kode masuk
              </label>
              <input
                id="loginCode"
                name="loginCode"
                type="text"
                className="signin__input"
                autoComplete="username"
                autoCapitalize="characters"
                inputMode="text"
                spellCheck={false}
                placeholder="S2026001"
                aria-invalid={errors.loginCode ? 'true' : 'false'}
                aria-describedby={errors.loginCode ? 'loginCode-error' : 'loginCode-help'}
                autoFocus
              />
              {errors.loginCode ? (
                <span id="loginCode-error" className="signin__error" role="alert">
                  {errors.loginCode}
                </span>
              ) : (
                <span id="loginCode-help" className="signin__hint">
                  Kode dibagikan oleh administrator sekolah. Hubungi tata usaha bila kode hilang.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="signin__submit"
              disabled={processing}
              aria-busy={processing}
            >
              <span>{processing ? 'Memeriksa…' : 'Masuk'}</span>
              <span className="signin__submit-icon" aria-hidden="true">
                <ArrowRight size={16} strokeWidth={2} />
              </span>
            </button>
          </div>
        )}
      </Form>

      <div className="signin__secure">
        <ShieldCheck size={15} strokeWidth={1.8} />
        <span>Sesi aman. Kode Anda tidak dibagikan ke siapa pun.</span>
      </div>

      <p className="signin__foot">
        Belum punya kode? Hubungi administrator sekolah untuk mendapatkannya.
      </p>
    </div>
  )
}

Signin.layout = [AuthLayout]
