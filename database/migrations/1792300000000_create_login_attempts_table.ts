import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Failed login counter backing the D14 throttle. One row per kode unik; it is
 * deleted on a successful sign-in and its window is reset once it goes stale.
 */
export default class extends BaseSchema {
  protected tableName = 'login_attempts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('kode_unik', 16).notNullable().unique()
      table.integer('failed_count').notNullable().defaultTo(0)
      table.bigInteger('window_started_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
