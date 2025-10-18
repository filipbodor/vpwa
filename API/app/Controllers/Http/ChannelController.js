'use strict'

const Channel = use('App/Models/Channel')

class ChannelController {
  async index({ auth, response }) {
    await auth.check()
    const channels = await Channel.query().withCount('messages as message_count').fetch()
    return response.ok(channels)
  }

  async store({ request, auth, response }) {
    const user = await auth.getUser()
    const { name, description, is_private } = request.only(['name', 'description', 'is_private'])
    const channel = await Channel.create({ name, description, is_private: !!is_private, owner_id: user.id })
    await channel.users().attach([user.id])
    return response.created(channel)
  }

  async show({ params, auth, response }) {
    await auth.check()
    const channel = await Channel.findOrFail(params.id)
    await channel.load('users')
    return response.ok(channel)
  }

  async join({ params, auth, response }) {
    const user = await auth.getUser()
    const channel = await Channel.findOrFail(params.id)
    await channel.users().attach([user.id])
    return response.ok({ ok: true })
  }
}

module.exports = ChannelController


