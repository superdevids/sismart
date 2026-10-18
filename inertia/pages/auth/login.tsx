import AuthLayout from '~/layouts/auth'
import { Form } from '@adonisjs/inertia/react'

export default function Login() {
  return (
    <>
      <h1 className="auth__title">Welcome back</h1>
      <p className="auth__sub">Sign in with your unique code to continue.</p>

      <Form route="session.store">
        {({ errors, processing }) => (
          <div className="auth__form">
            <div className="field">
              <label className="field__label" htmlFor="kodeUnik">
                Unique code
              </label>
              <input
                id="kodeUnik"
                name="kodeUnik"
                type="text"
                className="field__input"
                autoComplete="username"
                placeholder="S26101001"
                aria-invalid={errors.kodeUnik ? 'true' : 'false'}
              />
              {errors.kodeUnik && <span className="field__error">{errors.kodeUnik}</span>}
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
              />
              {errors.password && <span className="field__error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={processing}
              style={{ marginTop: 4 }}
            >
              {processing ? 'One moment…' : 'Sign in'}
            </button>
          </div>
        )}
      </Form>
    </>
  )
}

Login.layout = [AuthLayout]
