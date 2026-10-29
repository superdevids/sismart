import User, { USER_ROLES } from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

/** Label bahasa Indonesia untuk setiap peran. */
export const ROLE_LABELS: Record<string, string> = {
  siswa: 'Siswa',
  orang_tua: 'Orang tua',
  guru: 'Guru',
  staff: 'Staff',
  kepsek: 'Kepala sekolah',
  admin: 'Admin',
}

/**
 * Daftar pengguna untuk halaman admin. Membaca tabel `users` sungguhan —
 * tanpa data contoh. Pencarian dan paginasi dijalankan di sisi server agar
 * tetap ringan saat jumlah pengguna bertambah.
 */
export default class UsersController {
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const role = String(request.input('role', '')).trim()
    const page = Math.max(1, Number(request.input('page', 1)) || 1)
    const perPage = 10

    const query = User.query().orderBy('fullName', 'asc')

    if (q) {
      query.where((builder) => {
        builder.whereILike('fullName', `%${q}%`).orWhereILike('loginCode', `%${q}%`)
      })
    }

    if (role && (USER_ROLES as readonly string[]).includes(role)) {
      query.where('role', role)
    }

    const paginator = await query.paginate(page, perPage)
    const serialized = paginator.serialize()

    return inertia.render('users/index', {
      users: serialized.data.map((row: Record<string, unknown>) => ({
        id: row.id,
        fullName: row.fullName,
        loginCode: row.loginCode,
        role: row.role,
        roleLabel: ROLE_LABELS[String(row.role)] ?? String(row.role),
        isActive: row.isActive,
        lastLoginAt: row.lastLoginAt,
      })),
      meta: serialized.meta,
      filters: { q, role },
      roleOptions: USER_ROLES.map((value) => ({ value, label: ROLE_LABELS[value] ?? value })),
    })
  }
}
