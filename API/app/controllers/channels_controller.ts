import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import { DateTime } from 'luxon'
import { createChannelValidator, inviteUserValidator, kickUserValidator } from '#validators/channel'
import db from '@adonisjs/lucid/services/db'

export default class ChannelsController {
  /**
   * Get all channels where user is a member
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!

    const channels = await Channel.query()
      .whereHas('members', (query) => {
        query.where('user_id', user.id)
      })
      .preload('owner')
      .preload('members')
      .orderBy('last_active_at', 'desc')

    return response.ok({
      channels: channels.map((channel) => ({
        id: channel.id,
        name: channel.name,
        description: channel.description,
        isPrivate: channel.isPrivate,
        ownerId: channel.ownerId,
        lastActiveAt: channel.lastActiveAt.toMillis(),
        memberCount: channel.members.length,
        memberIds: channel.members.map((m) => m.id),
        // Check if user was recently invited (is_invited flag)
        isNewInvite: channel.members.find((m) => m.id === user.id)?.$extras.pivot_is_invited || false,
      })),
    })
  }

  /**
   * Create a new channel
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createChannelValidator)

    // Check if channel name already exists
    const existingChannel = await Channel.query()
      .whereRaw('LOWER(name) = ?', [data.name.toLowerCase()])
      .first()

    if (existingChannel) {
      return response.conflict({
        errors: [{ message: 'Channel name already exists' }],
      })
    }

    const channel = await Channel.create({
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      isPrivate: data.isPrivate || false,
      ownerId: user.id,
      lastActiveAt: DateTime.now(),
    })

    // Add creator as member
    await channel.related('members').attach({
      [user.id]: {
        is_invited: false,
        joined_at: DateTime.now(),
      },
    })

    await channel.load('members')

    return response.created({
      channel: {
        id: channel.id,
        name: channel.name,
        description: channel.description,
        isPrivate: channel.isPrivate,
        ownerId: channel.ownerId,
        lastActiveAt: channel.lastActiveAt.toMillis(),
        memberCount: channel.members.length,
        memberIds: channel.members.map((m) => m.id),
        isNewInvite: false,
      },
    })
  }

  /**
   * Get channel details
   */
  async show({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.find(params.id)

    if (!channel) {
      return response.notFound({
        errors: [{ message: 'Channel not found' }],
      })
    }

    await channel.load('members')
    await channel.load('owner')

    // Check if user is member
    const isMember = channel.members.some((m) => m.id === user.id)
    if (!isMember && channel.isPrivate) {
      return response.forbidden({
        errors: [{ message: 'You are not a member of this channel' }],
      })
    }

    return response.ok({
      channel: {
        id: channel.id,
        name: channel.name,
        description: channel.description,
        isPrivate: channel.isPrivate,
        ownerId: channel.ownerId,
        lastActiveAt: channel.lastActiveAt.toMillis(),
        memberCount: channel.members.length,
        memberIds: channel.members.map((m) => m.id),
        isOwner: channel.ownerId === user.id,
      },
    })
  }

  /**
   * Join a public channel
   */
  async join({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.find(params.id)

    if (!channel) {
      return response.notFound({
        errors: [{ message: 'Channel not found' }],
      })
    }

    if (channel.isPrivate) {
      return response.forbidden({
        errors: [{ message: 'Cannot join a private channel without an invitation' }],
      })
    }

    await channel.load('members')

    // Check if already a member
    if (channel.members.some((m) => m.id === user.id)) {
      return response.badRequest({
        errors: [{ message: 'You are already a member of this channel' }],
      })
    }

    await channel.related('members').attach({
      [user.id]: {
        is_invited: false,
        joined_at: DateTime.now(),
      },
    })

    await channel.load('members')

    return response.ok({
      channel: {
        id: channel.id,
        name: channel.name,
        description: channel.description,
        isPrivate: channel.isPrivate,
        ownerId: channel.ownerId,
        lastActiveAt: channel.lastActiveAt.toMillis(),
        memberCount: channel.members.length,
        memberIds: channel.members.map((m) => m.id),
      },
    })
  }

  /**
   * Leave a channel
   */
  async leave({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.find(params.id)

    if (!channel) {
      return response.notFound({
        errors: [{ message: 'Channel not found' }],
      })
    }

    await channel.load('members')

    // Check if user is member
    if (!channel.members.some((m) => m.id === user.id)) {
      return response.badRequest({
        errors: [{ message: 'You are not a member of this channel' }],
      })
    }

    // Owner cannot leave, must delete the channel
    if (channel.ownerId === user.id) {
      return response.badRequest({
        errors: [{ message: 'Channel owner cannot leave. Delete the channel instead.' }],
      })
    }

    await channel.related('members').detach([user.id])

    return response.ok({
      message: 'Successfully left the channel',
    })
  }

  /**
   * Invite user to channel
   */
  async invite({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(inviteUserValidator)
    const channel = await Channel.find(params.id)

    if (!channel) {
      return response.notFound({
        errors: [{ message: 'Channel not found' }],
      })
    }

    await channel.load('members')

    // Check if current user is member
    if (!channel.members.some((m) => m.id === user.id)) {
      return response.forbidden({
        errors: [{ message: 'You are not a member of this channel' }],
      })
    }

    // Check if invited user already member
    if (channel.members.some((m) => m.id === data.userId)) {
      return response.badRequest({
        errors: [{ message: 'User is already a member of this channel' }],
      })
    }

    await channel.related('members').attach({
      [data.userId]: {
        is_invited: true,
        joined_at: DateTime.now(),
      },
    })

    return response.ok({
      message: 'User invited successfully',
    })
  }

  /**
   * Kick user from channel (owner only)
   */
  async kick({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(kickUserValidator)
    const channel = await Channel.find(params.id)

    if (!channel) {
      return response.notFound({
        errors: [{ message: 'Channel not found' }],
      })
    }

    // Only owner can kick
    if (channel.ownerId !== user.id) {
      return response.forbidden({
        errors: [{ message: 'Only channel owner can kick members' }],
      })
    }

    // Cannot kick owner
    if (data.userId === channel.ownerId) {
      return response.badRequest({
        errors: [{ message: 'Cannot kick the channel owner' }],
      })
    }

    await channel.load('members')

    // Check if user is member
    if (!channel.members.some((m) => m.id === data.userId)) {
      return response.badRequest({
        errors: [{ message: 'User is not a member of this channel' }],
      })
    }

    await channel.related('members').detach([data.userId])

    return response.ok({
      message: 'User kicked successfully',
    })
  }

  /**
   * Delete channel (owner only)
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.find(params.id)

    if (!channel) {
      return response.notFound({
        errors: [{ message: 'Channel not found' }],
      })
    }

    // Only owner can delete
    if (channel.ownerId !== user.id) {
      return response.forbidden({
        errors: [{ message: 'Only channel owner can delete the channel' }],
      })
    }

    await channel.delete()

    return response.ok({
      message: 'Channel deleted successfully',
    })
  }

  /**
   * Clear invitation flag for current user
   */
  async clearInvite({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.find(params.id)

    if (!channel) {
      return response.notFound({
        errors: [{ message: 'Channel not found' }],
      })
    }

    await db
      .from('channel_users')
      .where('channel_id', channel.id)
      .where('user_id', user.id)
      .update({ is_invited: false })

    return response.ok({
      message: 'Invitation flag cleared',
    })
  }

  /**
   * Get all public channels (for discovery)
   */
  async public({ response }: HttpContext) {
    const channels = await Channel.query()
      .where('is_private', false)
      .preload('members')
      .orderBy('last_active_at', 'desc')

    return response.ok({
      channels: channels.map((channel) => ({
        id: channel.id,
        name: channel.name,
        description: channel.description,
        isPrivate: channel.isPrivate,
        ownerId: channel.ownerId,
        lastActiveAt: channel.lastActiveAt.toMillis(),
        memberCount: channel.members.length,
      })),
    })
  }
}
