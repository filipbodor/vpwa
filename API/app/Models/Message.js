'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Message extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }

  channel () {
    return this.belongsTo('App/Models/Channel')
  }
}

module.exports = Message


