'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ChannelsSchema extends Schema {
  up () {
    this.create('channels', (table) => {
      table.increments()
      table.string('name', 100).notNullable().unique()
      table.string('description', 255)
      table.boolean('is_private').notNullable().defaultTo(false)
      table
        .integer('owner_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('channels')
  }
}

module.exports = ChannelsSchema


