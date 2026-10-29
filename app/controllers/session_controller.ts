import User from '#models/user'
import { loginCodeValidator } from '#validators/user'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Session controller for Sismart.
 *
 * Authentication is code-only: the user submits their unique login code and,
 * when it matches an active account, a session is created and the user is sent
 * to the dashboard.
 */
export default class SessionController {
  /**
   * Render the sign-in page at `/auth/signin`.
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signin', {})
  }

  /**
   * Authenticate by unique login code.
   */
  async store({ request, auth, response, session }: HttpContext) {
    const { loginCode } = await request.validateUsing(loginCodeValidator)
    const normalized = loginCode.trim().toUpperCase()

    const user = await User.query().where('loginCode', normalized).first()

    /**
     * Generic error message on purpose: never reveal whether the code exists,
     * is disabled, or is simply wrong.
     */
    const invalid = () => {
      session.flash('error', 'Kode masuk tidak valid atau akun tidak aktif.')
      return response.redirect().toRoute('session.create')
    }

    if (!user || !user.isActive) {
      return invalid()
    }

    await auth.use('web').login(user)

    user.lastLoginAt = DateTime.now()
    await user.save()

    session.flash('success', 'Berhasil masuk. Selamat datang!')
    return response.redirect().toRoute('dashboard')
  }

  /**
   * Log the user out and return to the sign-in page.
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('session.create')
  }
}
