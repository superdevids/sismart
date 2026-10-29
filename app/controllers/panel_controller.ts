import User, { USER_ROLES, type UserRole } from '#models/user'
import { DateTime } from 'luxon'
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

/**
 * Jumlah akun yang dibuat per bulan untuk 6 bulan terakhir.
 * Dihitung dari kolom `created_at` yang memang ada — tidak ada angka karangan.
 * Bulan kosong tetap ditampilkan sebagai 0 agar sumbu waktu tidak bolong.
 */
async function signupTrend(months = 6) {
  const now = DateTime.now().startOf('month')
  const start = now.minus({ months: months - 1 })

  const rows = await User.query().where('createdAt', '>=', start.toSQL()!).select('createdAt')

  const buckets = new Map<string, number>()
  for (let i = 0; i < months; i++) {
    const month = start.plus({ months: i })
    buckets.set(month.toFormat('yyyy-MM'), 0)
  }

  for (const row of rows) {
    // Lucid mengembalikan DateTime untuk kolom dateTime, tetapi tipe statisnya
    // tidak menjamin itu. Tangani string/Date juga agar tidak meledak saat runtime.
    const value = row.createdAt as unknown
    let stamp: DateTime | null = null

    if (value instanceof DateTime) {
      stamp = value
    } else if (value instanceof Date) {
      stamp = DateTime.fromJSDate(value)
    } else if (typeof value === 'string') {
      const parsed = DateTime.fromSQL(value)
      stamp = parsed.isValid ? parsed : null
    }

    if (!stamp?.isValid) continue
    const key = stamp.toFormat('yyyy-MM')
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }

  return [...buckets.entries()].map(([key, value]) => ({
    label: DateTime.fromFormat(key, 'yyyy-MM').setLocale('id').toFormat('LLL'),
    value,
  }))
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
        const [{ counts, split }, recentUsers, trend] = await Promise.all([
          aggregates(),
          latestAccounts(5),
          signupTrend(),
        ])

        return inertia.render('panel/admin', {
          profile,
          stats: { total: counts.total, active: counts.active },
          roleBreakdown: split,
          recentUsers,
          trend,
        })
      }

      case 'kepsek': {
        const [{ counts, split }, trend] = await Promise.all([aggregates(), signupTrend()])

        return inertia.render('panel/kepsek', {
          profile,
          stats: {
            total: counts.total,
            active: counts.active,
            students: roleTotal(split, 'siswa'),
            teachers: roleTotal(split, 'guru'),
          },
          roleBreakdown: split,
          trend,
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
