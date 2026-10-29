import User, { USER_ROLES, type UserRole } from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

type AggregateRow = { role: string; $extras?: { total?: string | number } }

function totalOf(rows: unknown[]): number {
  const first = rows[0] as { $extras?: { total?: string | number } } | undefined
  return Number(first?.$extras?.total ?? 0)
}

function roleTotal(split: { role: string; total: number }[], role: UserRole): number {
  return split.find((row) => row.role === role)?.total ?? 0
}

async function accountCounts() {
  const [total, active] = await Promise.all([
    User.query().count('* as total'),
    User.query().where('isActive', true).count('* as total'),
  ])

  const all = totalOf(total)
  const activeCount = totalOf(active)

  return { total: all, active: activeCount, inactive: all - activeCount }
}

async function roleSplit() {
  const rows = (await User.query()
    .select('role')
    .count('* as total')
    .groupBy('role')) as unknown as AggregateRow[]

  const byRole = Object.fromEntries(rows.map((row) => [String(row.role), totalOf([row])]))

  return USER_ROLES.map((role) => ({ role, total: byRole[role] ?? 0 }))
}

async function latestAccounts(limit: number) {
  const rows = await User.query().orderBy('createdAt', 'desc').limit(limit)

  return rows.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    loginCode: user.loginCode,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt?.toISO() ?? null,
  }))
}

async function aggregates() {
  const [counts, split] = await Promise.all([accountCounts(), roleSplit()])
  return { counts, split }
}

export default class PanelController {
  async index({ auth, inertia, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.redirect().toRoute('session.create')
    }

    const role = user.role as UserRole

    const profile = {
      fullName: user.fullName,
      loginCode: user.loginCode,
      role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt?.toISO() ?? null,
    }

    switch (role) {
      case 'admin': {
        const [{ counts, split }, recentUsers] = await Promise.all([
          aggregates(),
          latestAccounts(5),
        ])

        return inertia.render('panel/admin', {
          profile,
          stats: { total: counts.total, active: counts.active },
          roleBreakdown: split,
          recentUsers,
        })
      }

      case 'kepsek': {
        const { counts, split } = await aggregates()

        return inertia.render('panel/kepsek', {
          profile,
          stats: {
            total: counts.total,
            active: counts.active,
            students: roleTotal(split, 'siswa'),
            teachers: roleTotal(split, 'guru'),
          },
          roleBreakdown: split,
        })
      }

      case 'guru': {
        const { counts, split } = await aggregates()

        return inertia.render('panel/guru', {
          profile,
          stats: {
            students: roleTotal(split, 'siswa'),
            teachers: roleTotal(split, 'guru'),
            active: counts.active,
          },
        })
      }

      case 'staff': {
        const { counts, split } = await aggregates()

        return inertia.render('panel/staff', {
          profile,
          stats: {
            students: roleTotal(split, 'siswa'),
            active: counts.active,
            inactive: counts.inactive,
          },
        })
      }

      case 'orang_tua': {
        return inertia.render('panel/orang_tua', { profile })
      }

      default: {
        return inertia.render('panel/siswa', { profile })
      }
    }
  }
}
