import env from '#start/env'
import Role from '#models/role'
import User from '#models/user'
import { ROLES } from '#services/roles'
import { isValidKodeUnik } from '#services/kode_unik'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

/**
 * Creates (or updates) the bootstrap administrator from environment variables,
 * so no credentials live in the source tree. Idempotent: re-running it resets
 * the admin password.
 *
 *   node ace admin:create
 */
export default class CreateAdmin extends BaseCommand {
  static commandName = 'admin:create'
  static description = 'Create or update the bootstrap administrator from ADMIN_* env variables'
  static options: CommandOptions = { startApp: true }

  async run() {
    const kodeUnik = env.get('ADMIN_KODE_UNIK')
    const password = env.get('ADMIN_PASSWORD')
    const fullName = env.get('ADMIN_NAME') ?? 'Administrator'

    if (!kodeUnik || !password) {
      this.logger.error('Set ADMIN_KODE_UNIK and ADMIN_PASSWORD in the environment first')
      this.exitCode = 1
      return
    }

    if (!isValidKodeUnik(kodeUnik)) {
      this.logger.error(`ADMIN_KODE_UNIK "${kodeUnik}" does not match the kode unik format`)
      this.exitCode = 1
      return
    }

    if (password.length < 8) {
      this.logger.error('ADMIN_PASSWORD must be at least 8 characters long')
      this.exitCode = 1
      return
    }

    const adminRole = await Role.findByOrFail('name', ROLES.admin)

    const user = await User.updateOrCreate(
      { kodeUnik },
      { kodeUnik, fullName, password, roleId: adminRole.id, isActive: true }
    )

    this.logger.success(`Bootstrap admin "${user.kodeUnik}" is ready`)
  }
}
