import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'direct_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table.uuid('user1_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('user2_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('last_message_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Ensure user1_id < user2_id for consistency
      table.check('user1_id < user2_id')
      
      // Unique constraint to prevent duplicate DM conversations
      table.unique(['user1_id', 'user2_id'])
      
      // Indexes
      table.index('user1_id')
      table.index('user2_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
