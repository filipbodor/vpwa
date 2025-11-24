import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channel_bans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('channel_id').notNullable().references('id').inTable('channels').onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('banned_by').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.enum('ban_type', ['owner', 'vote']).notNullable()
      table.integer('vote_count').defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['channel_id', 'user_id'])
    })

    this.schema.createTable('channel_kick_votes', (table) => {
      table.increments('id').primary()
      table.uuid('channel_id').notNullable().references('id').inTable('channels').onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('voted_by').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()

      table.unique(['channel_id', 'user_id', 'voted_by'])
    })
  }

  async down() {
    this.schema.dropTable('channel_kick_votes')
    this.schema.dropTable(this.tableName)
  }
}