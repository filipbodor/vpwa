'use strict'

const Channel = use('App/Models/Channel')

class ChannelController {
  async index({ auth, response }) {
    const user = await auth.getUser()
    const channels = await Channel
      .query()
      .innerJoin('channel_user', 'channels.id', 'channel_user.channel_id')
      .where('channel_user.user_id', user.id)
      .select('channels.*')
      .withCount('messages as message_count')
      .fetch()
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
    await channel.load(builder => builder
      .load('messages', (q) => {
        q.with('user')
        q.orderBy('created_at', 'asc')
      })
    )
    return response.ok(channel)
  }

  async join({ params, auth, response }) {
    const user = await auth.getUser()
    const channel = await Channel.findOrFail(params.id)
    await channel.users().attach([user.id])
    return response.ok({ ok: true })
  }

  async joinByName({ request, auth, response }) {
    const user = await auth.getUser()
    const name = request.input('name')
    if (!name) {
      return response.badRequest({ error: { message: 'Channel name is required' } })
    }
    const channel = await Channel.query().where('name', name).first()
    if (!channel) {
      return response.notFound({ error: { message: 'Channel not found' } })
    }
    const existing = await channel.users().where('user_id', user.id).first()
    if (!existing) {
      await channel.users().attach([user.id])
    }
    return response.ok({ ok: true, channel })
  }
}

module.exports = ChannelController


