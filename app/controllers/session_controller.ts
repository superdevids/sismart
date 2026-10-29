import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { loginCodeValidator } from '#validators/user'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'

let timingHash: string | undefined
async function dummyHash() {
  timingHash ??= await hash.make('sismart-timing-only')
  return timingHash
}

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signin', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { loginCode, password } = await request.validateUsing(loginCodeValidator)
    const normalized = loginCode.trim().toUpperCase()

    const invalid = () => {
      session.flash('error', 'Kode masuk atau password salah, atau akun tidak aktif.')
      return response.redirect().toRoute('session.create')
    }

    const user = await User.query().where('loginCode', normalized).first()

    const storedHash = user?.password ?? (await dummyHash())
    const passwordMatches = await hash.verify(storedHash, password)

    if (!user || !user.isActive || !user.password || !passwordMatches) {
      return invalid()
    }

    await auth.use('web').login(user)

    user.lastLoginAt = DateTime.now()
    await user.save()

    session.flash('success', 'Berhasil masuk. Selamat datang!')
    return response.redirect().toRoute('dashboard')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('session.create')
  }
}
