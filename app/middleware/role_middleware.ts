import type { RoleName } from '#services/roles'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Restricts a route to users holding one of the given roles. Runs after the
 * auth middleware, so it can assume an authenticated user.
 */
export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, roles: RoleName[]) {
    const user = ctx.auth.getUserOrFail()
    await user.load('role')

    if (!user.hasRole(...roles)) {
      throw new Exception('Anda tidak memiliki akses ke halaman ini.', {
        status: 403,
        code: 'E_FORBIDDEN',
      })
    }

    return next()
  }
}
