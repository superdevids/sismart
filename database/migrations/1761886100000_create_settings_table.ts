import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Application settings store (key/value).
 *
 * Holds configuration the admin can change at runtime without a deploy —
 * starting with branding (school name, tagline, contact details). One row per
 * setting; `key` is unique.
 */
export default class extends BaseSchema {
  protected tableName = 'settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('key', 128).notNullable().unique()
      table.text('value').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
