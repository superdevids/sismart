import type { NextFn } from '@adonisjs/core/types/http'
import { USER_ROLES, type UserRole } from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export type RoleMiddlewareOptions = {
  roles?: UserRole[]
}

export default class RoleMiddleware {
  async handle(
    { auth, response, session }: HttpContext,
    next: NextFn,
    options: RoleMiddlewareOptions = {}
  ) {
    const user = auth.user

    if (!user) {
      return response.redirect().toRoute('session.create')
    }

    const allowed = (options.roles ?? [...USER_ROLES]) as readonly string[]

    if (!allowed.includes(user.role)) {
      session.flash('error', 'Anda tidak memiliki akses ke halaman tersebut.')
      return response.redirect().toRoute('panel')
    }

    return next()
  }
}
