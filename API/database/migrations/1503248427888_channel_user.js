'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChannelUserSchema extends Schema {
  up () {
    this.create('channel_user', (table) => {
      table.increments()
      table
        .integer('channel_id')
        .unsigned()
        .references('id')
        .inTable('channels')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.unique(['channel_id', 'user_id'])
      table.timestamps()
    })
  }

  down () {
    this.drop('channel_user')
  }
}

module.exports = ChannelUserSchema


