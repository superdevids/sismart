import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { kodeUnik, password } = await request.validateUsing(loginValidator)

    let user: User
    try {
      user = await User.verifyCredentials(kodeUnik, password)
    } catch {
      // Same message for unknown codes and wrong passwords to avoid leaking
      // which kode unik values exist.
      session.flash('error', 'Kode unik atau password salah.')
      return response.redirect().back()
    }

    if (!user.isActive) {
      session.flash('error', 'Akun ini tidak aktif. Hubungi administrator.')
      return response.redirect().back()
    }

    await auth.use('web').login(user)
    return response.redirect().toRoute('dashboard')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('session.create')
  }
}
