import { isKnownRoleName } from '#services/roles'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Gate for authenticated users that still have no usable role (D16). They are
 * sent to the waiting-for-activation page instead of any protected area, so an
 * account without a role never reaches the dashboard. Runs after the auth
 * middleware, so it can assume an authenticated user.
 */
export default class RoleActivatedMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.getUserOrFail()
    await user.load('role')

    if (!isKnownRoleName(user.role?.name)) {
      return ctx.response.redirect().toRoute('activation')
    }

    return next()
  }
}
