import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table.string('name', 100).notNullable()
      table.text('description').nullable()
      table.boolean('is_private').defaultTo(false)
      table.uuid('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('last_active_at').notNullable().defaultTo(this.now())
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    // Index for finding channels by name
    this.schema.raw('CREATE INDEX channels_name_lower_idx ON channels (LOWER(name))')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
