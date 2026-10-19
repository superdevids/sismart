import env from '#start/env'
import Role from '#models/role'
import User from '#models/user'
import { ROLES } from '#services/roles'
import { isValidKodeUnik } from '#services/kode_unik'
import { PASSWORD_MIN_LENGTH, passwordValidator } from '#validators/password'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

/**
 * Creates (or updates) the bootstrap administrator from environment variables,
 * so no credentials live in the source tree. Idempotent: re-running it resets
 * the admin password.
 *
 * A code that already belongs to a non-admin account is never promoted
 * silently; pass `--force` to override that guard (P3).
 *
 *   node ace admin:create
 */
export default class CreateAdmin extends BaseCommand {
  static commandName = 'admin:create'
  static description = 'Create or update the bootstrap administrator from ADMIN_* env variables'
  static options: CommandOptions = { startApp: true }

  @flags.boolean({ description: 'Promote an existing non-admin account holding this code' })
  declare force: boolean

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

    try {
      await passwordValidator.validate({ password })
    } catch {
      this.logger.error(`ADMIN_PASSWORD must be at least ${PASSWORD_MIN_LENGTH} characters long`)
      this.exitCode = 1
      return
    }

    const adminRole = await Role.findByOrFail('name', ROLES.admin)

    const existing = await User.findBy('kodeUnik', kodeUnik)

    if (existing && existing.roleId !== adminRole.id && !this.force) {
      this.logger.error(
        `Kode unik "${kodeUnik}" already belongs to a non-admin account; refusing to promote it. Re-run with --force to override.`
      )
      this.exitCode = 1
      return
    }

    const user = await User.updateOrCreate(
      { kodeUnik },
      { kodeUnik, fullName, password, roleId: adminRole.id, isActive: true }
    )

    this.logger.success(`Bootstrap admin "${user.kodeUnik}" is ready`)
  }
}
