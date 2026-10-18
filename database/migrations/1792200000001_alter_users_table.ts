import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Replaces the boilerplate email identity with the platform's kode unik and
 * adds the role/status fields. The table is recreated instead of altered
 * because SQLite cannot add a UNIQUE column or a foreign key via ALTER TABLE.
 * It is safe here: the `users` table is empty until the bootstrap admin is
 * created, so no data is lost.
 */
export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.dropTable(this.tableName)

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('kode_unik', 16).notNullable().unique()
      table.string('full_name').nullable()
      table.string('password').notNullable()
      table
        .integer('role_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('roles')
        .onDelete('SET NULL')
      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }
}
