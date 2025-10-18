'use strict'

const Message = use('App/Models/Message')
const Channel = use('App/Models/Channel')

class MessageController {
  async index({ params, auth, response }) {
    await auth.check()
    const channel = await Channel.findOrFail(params.channelId)
    const messages = await Message.query().where('channel_id', channel.id).with('user').orderBy('created_at', 'asc').fetch()
    return response.ok(messages)
  }

  async store({ params, request, auth, response }) {
    const user = await auth.getUser()
    const channel = await Channel.findOrFail(params.channelId)
    const { content } = request.only(['content'])
    const message = await Message.create({ channel_id: channel.id, user_id: user.id, content })
    await message.load('user')
    return response.created(message)
  }
}

module.exports = MessageController


