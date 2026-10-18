import { ROLE_SEEDS } from '#services/roles'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name', 32).notNullable().unique()
      table.string('label', 64).notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })

    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert(ROLE_SEEDS)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
