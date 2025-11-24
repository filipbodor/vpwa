import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channel_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('channel_id').notNullable().references('id').inTable('channels').onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.boolean('is_invited').defaultTo(false)
      table.timestamp('joined_at').notNullable().defaultTo(this.now())
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Unique constraint to prevent duplicate memberships
      table.unique(['channel_id', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
