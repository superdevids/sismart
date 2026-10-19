import AuthLayout from '~/layouts/auth'
import { Form } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'

/**
 * Mirrors `node ace dev:accounts` (commands/seed_dev_accounts.ts). The list is
 * duplicated here because the Inertia client cannot import `#services`; it is
 * only ever rendered outside production via the `inDev` shared prop.
 */
const DEV_PASSWORD = 'pass1234'
const DEV_ACCOUNTS: Array<[string, string]> = [
  ['K261001', 'admin'],
  ['K261002', 'kepala_sekolah'],
  ['K261003', 'guru'],
  ['K261004', 'staff'],
  ['K261005', 'wali'],
  ['S26101001', 'siswa'],
  ['S26111002', 'siswa'],
]

function DevAccounts() {
  return (
    <div
      style={{
        marginTop: 20,
        padding: '12px 14px',
        border: '1px solid var(--line)',
        borderRadius: 10,
        background: 'var(--paper)',
        fontFamily: 'var(--mono)',
        fontSize: 12,
      }}
    >
      <p style={{ margin: 0, color: 'var(--ink-2)' }}>Akun untuk pengembangan</p>
      <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0 }}>
        {DEV_ACCOUNTS.map(([kodeUnik, role]) => (
          <li key={kodeUnik} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ color: 'var(--ink)' }}>{kodeUnik}</span>
            <span style={{ color: 'var(--muted)' }}>{role}</span>
            <span style={{ color: 'var(--ink)' }}>{DEV_PASSWORD}</span>
          </li>
        ))}
      </ul>
      <p style={{ margin: '8px 0 0', color: 'var(--muted)' }}>
        DEV ONLY — jangan dipakai di produksi.
      </p>
    </div>
  )
}

export default function Login() {
  const { inDev } = usePage().props

  return (
    <>
      <h1 className="auth__title">Selamat datang kembali</h1>
      <p className="auth__sub">Masuk dengan kode unik untuk melanjutkan.</p>

      <Form route="session.store">
        {({ errors, processing }) => (
          <div className="auth__form">
            <div className="field">
              <label className="field__label" htmlFor="kodeUnik">
                Kode unik
              </label>
              <input
                id="kodeUnik"
                name="kodeUnik"
                type="text"
                className="field__input"
                autoComplete="username"
                placeholder="S26101001"
                aria-invalid={errors.kodeUnik ? 'true' : 'false'}
                aria-describedby={errors.kodeUnik ? 'kodeUnik-error' : undefined}
              />
              {errors.kodeUnik && (
                <span id="kodeUnik-error" role="alert" className="field__error">
                  {errors.kodeUnik}
                </span>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="field__input"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <span id="password-error" role="alert" className="field__error">
                  {errors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={processing}
              style={{ marginTop: 4 }}
            >
              {processing ? 'Sebentar…' : 'Masuk'}
            </button>
          </div>
        )}
      </Form>

      {inDev && <DevAccounts />}
    </>
  )
}

Login.layout = [AuthLayout]
