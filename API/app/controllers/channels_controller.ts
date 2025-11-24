import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import ChannelBan from '#models/channel_ban'
import ChannelKickVote from '#models/channel_kick_vote'
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
      .preload('members', (query) => {
        query.pivotColumns(['is_invited', 'joined_at'])
      })
      .orderBy('last_active_at', 'desc')

    return response.ok({
      channels: channels.map((channel) => {
        const currentMember = channel.members.find((m) => m.id === user.id)
        const isInvited = currentMember?.$extras.pivot_is_invited ?? false
        
        return {
          id: channel.id,
          name: channel.name,
          description: channel.description,
          isPrivate: channel.isPrivate,
          ownerId: channel.ownerId,
          lastActiveAt: channel.lastActiveAt.toMillis(),
          memberCount: channel.members.length,
          memberIds: channel.members.map((m) => m.id),
          members: channel.members.map((m) => ({
            id: m.id,
            username: m.username,
            firstName: m.firstName,
            lastName: m.lastName,
            fullName: m.fullName,
            avatar: m.avatar,
            status: m.status,
          })),
          isNewInvite: isInvited,
        }
      }),
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
      const thirtyDaysAgo = DateTime.now().minus({ days: 30 })
      
      if (existingChannel.lastActiveAt < thirtyDaysAgo) {
        await existingChannel.related('members').detach()
        await existingChannel.delete()
      } else {
        return response.conflict({
          errors: [{ message: 'Channel name already exists' }],
        })
      }
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
        members: channel.members.map((m) => ({
          id: m.id,
          username: m.username,
          firstName: m.firstName,
          lastName: m.lastName,
          fullName: m.fullName,
          avatar: m.avatar,
          status: m.status,
        })),
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
        members: channel.members.map((m) => ({
          id: m.id,
          username: m.username,
          firstName: m.firstName,
          lastName: m.lastName,
          fullName: m.fullName,
          avatar: m.avatar,
          status: m.status,
        })),
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

    // Check if user is banned
    const ban = await ChannelBan.query()
      .where('channel_id', channel.id)
      .where('user_id', user.id)
      .first()

    if (ban) {
      return response.forbidden({
        errors: [{ message: 'You are banned from this channel' }],
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

    // Check if user is banned
    const ban = await ChannelBan.query()
      .where('channel_id', channel.id)
      .where('user_id', data.userId)
      .first()

    if (ban) {
      // Only owner can unban
      if (channel.ownerId !== user.id) {
        return response.forbidden({
          errors: [{ message: 'This user is banned from the channel. Only the owner can unban them.' }],
        })
      }

      // Owner inviting = unban + invite
      await ban.delete()
      await ChannelKickVote.query()
        .where('channel_id', channel.id)
        .where('user_id', data.userId)
        .delete()
    }

    await channel.related('members').attach({
      [data.userId]: {
        is_invited: true,
        joined_at: DateTime.now(),
      },
    })

    return response.ok({
      message: ban ? 'User unbanned and invited successfully' : 'User invited successfully',
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

    // Remove from channel
    await channel.related('members').detach([data.userId])

    // Create permanent ban
    await ChannelBan.updateOrCreate(
      {
        channelId: channel.id,
        userId: data.userId,
      },
      {
        bannedBy: user.id,
        banType: 'owner',
        voteCount: 0,
      }
    )

    // Clear any existing votes
    await ChannelKickVote.query()
      .where('channel_id', channel.id)
      .where('user_id', data.userId)
      .delete()

    return response.ok({
      message: 'User kicked and banned permanently',
    })
  }

  /**
   * Vote to kick user from channel
   */
  async voteKick({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(kickUserValidator)
    const channel = await Channel.find(params.id)

    if (!channel) {
      return response.notFound({
        errors: [{ message: 'Channel not found' }],
      })
    }

    // Cannot vote kick in private channels (only owner can kick)
    if (channel.isPrivate) {
      return response.forbidden({
        errors: [{ message: 'Vote kick is not available in private channels' }],
      })
    }

    await channel.load('members')

    // Check if voter is member
    if (!channel.members.some((m) => m.id === user.id)) {
      return response.forbidden({
        errors: [{ message: 'You must be a member to vote' }],
      })
    }

    // Cannot vote kick owner
    if (data.userId === channel.ownerId) {
      return response.badRequest({
        errors: [{ message: 'Cannot kick the channel owner' }],
      })
    }

    // Check if target user is member
    if (!channel.members.some((m) => m.id === data.userId)) {
      return response.badRequest({
        errors: [{ message: 'User is not a member of this channel' }],
      })
    }

    // Cannot vote for yourself
    if (data.userId === user.id) {
      return response.badRequest({
        errors: [{ message: 'Cannot vote to kick yourself' }],
      })
    }

    // Record vote
    await ChannelKickVote.updateOrCreate(
      {
        channelId: channel.id,
        userId: data.userId,
        votedBy: user.id,
      },
      {}
    )

    // Count total votes
    const voteCount = await ChannelKickVote.query()
      .where('channel_id', channel.id)
      .where('user_id', data.userId)
      .count('* as total')

    const totalVotes = Number(voteCount[0].$extras.total)

    // If 3 or more votes, kick and ban
    if (totalVotes >= 3) {
      await channel.related('members').detach([data.userId])

      // Create permanent ban
      await ChannelBan.updateOrCreate(
        {
          channelId: channel.id,
          userId: data.userId,
        },
        {
          bannedBy: user.id,
          banType: 'vote',
          voteCount: totalVotes,
        }
      )

      // Clear votes
      await ChannelKickVote.query()
        .where('channel_id', channel.id)
        .where('user_id', data.userId)
        .delete()

      return response.ok({
        message: 'User has been kicked and banned (3+ votes)',
        votes: totalVotes,
      })
    }

    return response.ok({
      message: `Vote recorded (${totalVotes}/3 votes)`,
      votes: totalVotes,
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
