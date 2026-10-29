import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Migrate `users` from email/password auth to unique-code auth (Sismart).
 *
 * - Adds `login_code` (unique), `role`, `is_active`, `last_login_at`.
 * - Makes `email` and `password` nullable so the old columns survive without
 *   breaking existing rows; they are no longer the primary login path.
 */
export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('login_code', 32).nullable().unique()
      table
        .enum('role', ['siswa', 'orang_tua', 'guru', 'staff', 'kepsek', 'admin'])
        .notNullable()
        .defaultTo('siswa')
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('last_login_at').nullable()

      table.string('email', 254).nullable().alter()
      table.string('password').nullable().alter()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.index(['role'], 'users_role_index')
      table.index(['is_active'], 'users_is_active_index')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['role'], 'users_role_index')
      table.dropIndex(['is_active'], 'users_is_active_index')
      table.dropColumn('login_code')
      table.dropColumn('role')
      table.dropColumn('is_active')
      table.dropColumn('last_login_at')
      table.string('email', 254).notNullable().alter()
      table.string('password').notNullable().alter()
    })
  }
}
