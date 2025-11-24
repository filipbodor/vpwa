import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable()
      table.uuid('channel_id').nullable().references('id').inTable('channels').onDelete('CASCADE')
      table.uuid('direct_message_id').nullable().references('id').inTable('direct_messages').onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.text('content').notNullable()
      table.jsonb('mentions').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.check('(channel_id IS NOT NULL AND direct_message_id IS NULL) OR (channel_id IS NULL AND direct_message_id IS NOT NULL)')
      
      table.index(['channel_id', 'created_at'])
      table.index(['direct_message_id', 'created_at'])
      table.index('user_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
