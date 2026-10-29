import User, { USER_ROLES } from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const [total, active] = await Promise.all([
      User.query().count('* as total'),
      User.query().where('isActive', true).count('* as total'),
    ])

    const perRole = await User.query().select('role').count('* as total').groupBy('role')

    const roleCounts = Object.fromEntries(
      perRole.map((row) => [
        String(row.role),
        Number((row as unknown as { $extras: { total: number } }).$extras.total ?? 0),
      ])
    )

    const recent = await User.query().orderBy('createdAt', 'desc').limit(5)

    return inertia.render('dashboard', {
      stats: {
        total: Number((total[0] as unknown as { $extras: { total: number } }).$extras.total ?? 0),
        active: Number((active[0] as unknown as { $extras: { total: number } }).$extras.total ?? 0),
      },
      roleBreakdown: USER_ROLES.map((role) => ({
        role,
        total: roleCounts[role] ?? 0,
      })),
      recentUsers: recent.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        loginCode: u.loginCode,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt?.toISO() ?? null,
      })),
    })
  }
}
