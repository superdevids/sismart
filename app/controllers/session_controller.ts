import User from '#models/user'
import { loginValidator } from '#validators/user'
import { isKnownRoleName } from '#services/roles'
import { clearFailedAttempts, isLockedOut, recordFailedAttempt } from '#services/login_attempts'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * One message for every failed sign-in path — unknown code, wrong password,
 * disabled account or throttled request — so none of them can be told apart.
 */
const INVALID_CREDENTIALS_MESSAGE = 'Kode unik atau password salah.'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { kodeUnik, password } = await request.validateUsing(loginValidator)

    if (await isLockedOut(kodeUnik)) {
      session.flash('error', INVALID_CREDENTIALS_MESSAGE)
      return response.redirect().back()
    }

    let user: User
    try {
      user = await User.verifyCredentials(kodeUnik, password)
    } catch {
      await recordFailedAttempt(kodeUnik)
      session.flash('error', INVALID_CREDENTIALS_MESSAGE)
      return response.redirect().back()
    }

    if (!user.isActive) {
      // D15: a disabled account answers exactly like a wrong password so its
      // existence cannot be inferred.
      await recordFailedAttempt(kodeUnik)
      session.flash('error', INVALID_CREDENTIALS_MESSAGE)
      return response.redirect().back()
    }

    await clearFailedAttempts(kodeUnik)
    await auth.use('web').login(user)

    // D16: accounts without a usable role wait on the activation page.
    await user.load('role')
    if (!isKnownRoleName(user.role?.name)) {
      return response.redirect().toRoute('activation')
    }

    return response.redirect().toRoute('dashboard')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('session.create')
  }
}
