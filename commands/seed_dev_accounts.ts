import Role from '#models/role'
import User from '#models/user'
import { ROLES, type RoleName } from '#services/roles'
import { isValidKodeUnik } from '#services/kode_unik'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

/**
 * Seeds one development account per role so every screen can be exercised
 * locally without hand-crafting users. Idempotent: re-running it resets the
 * accounts by kode unik, and it refuses to run in production.
 *
 *   node ace dev:accounts
 */

const DEV_PASSWORD = 'pass1234'

interface DevAccount {
  kodeUnik: string
  fullName: string
  role: RoleName
}

const DEV_ACCOUNTS: DevAccount[] = [
  { kodeUnik: 'K261001', fullName: 'Admin Sismart', role: ROLES.admin },
  { kodeUnik: 'K261002', fullName: 'Kepala Sekolah', role: ROLES.kepalaSekolah },
  { kodeUnik: 'K261003', fullName: 'Guru Sismart', role: ROLES.guru },
  { kodeUnik: 'K261004', fullName: 'Staff Sismart', role: ROLES.staff },
  // Wali has no dedicated code format yet, so it borrows the karyawan "K"
  // pattern. A dev-only decision; WV-7 may revise it.
  { kodeUnik: 'K261005', fullName: 'Wali Sismart', role: ROLES.wali },
  { kodeUnik: 'S26101001', fullName: 'Siswa TKJ', role: ROLES.siswa },
  { kodeUnik: 'S26111002', fullName: 'Siswa RPL', role: ROLES.siswa },
]

export default class SeedDevAccounts extends BaseCommand {
  static commandName = 'dev:accounts'
  static description = 'Seed one development account per role (never runs in production)'
  static options: CommandOptions = { startApp: true }

  async run() {
    if (this.app.inProduction) {
      this.logger.error('dev:accounts refuses to run while NODE_ENV=production')
      this.exitCode = 1
      return
    }

    // The login validator rejects codes that do not match the platform format,
    // so a malformed seed code would only surface as an unusable account later.
    for (const account of DEV_ACCOUNTS) {
      if (!isValidKodeUnik(account.kodeUnik)) {
        this.logger.error(`Dev account code "${account.kodeUnik}" has an invalid format`)
        this.exitCode = 1
        return
      }
    }

    // A single query for every role instead of one lookup per account.
    const roles = await Role.all()
    const roleIdByName = new Map(roles.map((role) => [role.name, role.id]))

    for (const account of DEV_ACCOUNTS) {
      const roleId = roleIdByName.get(account.role)
      if (roleId === undefined) {
        this.logger.error(`Role "${account.role}" is missing; run the migrations first`)
        this.exitCode = 1
        return
      }

      await User.updateOrCreate(
        { kodeUnik: account.kodeUnik },
        {
          kodeUnik: account.kodeUnik,
          fullName: account.fullName,
          password: DEV_PASSWORD,
          roleId,
          isActive: true,
        }
      )
    }

    this.logger.success(`${DEV_ACCOUNTS.length} development accounts are ready`)

    const table = this.ui.table()
    table.head(['Kode unik', 'Role', 'Password'])
    for (const account of DEV_ACCOUNTS) {
      table.row([account.kodeUnik, account.role, DEV_PASSWORD])
    }
    table.render()
  }
}
