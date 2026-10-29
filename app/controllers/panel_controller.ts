import type { UserRole } from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Setiap peran mendapat komponen panel sendiri pada URL yang sama.
 * Halaman panel sengaja dikosongkan: kontennya akan diisi saat modul terkait
 * dibangun, sehingga tidak ada query yang sia-sia maupun data contoh.
 */
const PANEL_COMPONENTS: Record<
  UserRole,
  'panel/admin' | 'panel/kepsek' | 'panel/guru' | 'panel/staff' | 'panel/orang_tua' | 'panel/siswa'
> = {
  admin: 'panel/admin',
  kepsek: 'panel/kepsek',
  guru: 'panel/guru',
  staff: 'panel/staff',
  orang_tua: 'panel/orang_tua',
  siswa: 'panel/siswa',
}

export default class PanelController {
  async index({ auth, inertia, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.redirect().toRoute('session.create')
    }

    const role = user.role as UserRole

    return inertia.render(PANEL_COMPONENTS[role] ?? 'panel/siswa', {
      profile: {
        fullName: user.fullName,
        loginCode: user.loginCode,
        role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt?.toISO() ?? null,
      },
    })
  }
}
