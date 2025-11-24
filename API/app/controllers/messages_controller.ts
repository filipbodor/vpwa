import type { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'
import Channel from '#models/channel'
import User from '#models/user'
import { DateTime } from 'luxon'
import vine from '@vinejs/vine'
import { WebSocketService } from '#services/websocket_service'

const sendMessageValidator = vine.compile(
  vine.object({
    content: vine.string().minLength(1).maxLength(5000).trim(),
  })
)

export default class MessagesController {
  /**
   * Get messages for a channel
   */
  async index({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channelId = params.channelId
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)

    const channel = await Channel.find(channelId)
    if (!channel) {
      return response.notFound({
        errors: [{ message: 'Channel not found' }],
      })
    }

    await channel.load('members')

    // Check if user is member
    const isMember = channel.members.some((m) => m.id === user.id)
    if (!isMember && channel.isPrivate) {
      return response.forbidden({
        errors: [{ message: 'You are not a member of this channel' }],
      })
    }

    const messages = await Message.query()
      .where('channel_id', channelId)
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.ok({
      messages: messages.all().reverse().map((msg) => ({
        id: msg.id,
        userId: msg.userId,
        content: msg.content,
        mentions: msg.mentions || [],
        createdAt: msg.createdAt.toMillis(),
        user: {
          id: msg.user.id,
          username: msg.user.username,
          firstName: msg.user.firstName,
          lastName: msg.user.lastName,
          fullName: msg.user.fullName,
          avatar: msg.user.avatar,
        },
      })),
      meta: messages.getMeta(),
    })
  }

  /**
   * Send message to a channel
   */
  async store({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channelId = params.channelId
    const data = await request.validateUsing(sendMessageValidator)

    const channel = await Channel.find(channelId)
    if (!channel) {
      return response.notFound({
        errors: [{ message: 'Channel not found' }],
      })
    }

    await channel.load('members')

    const isMember = channel.members.some((m) => m.id === user.id)
    if (!isMember) {
      return response.forbidden({
        errors: [{ message: 'You must be a member to send messages' }],
      })
    }

    const mentionPattern = /@(\w+)/g
    const mentionMatches = [...data.content.matchAll(mentionPattern)]
    const mentionedUsernames = [...new Set(mentionMatches.map(m => m[1]))]
    
    const mentionedUsers = await User.query()
      .whereIn('username', mentionedUsernames)
      .select('id')
    
    const mentionIds = mentionedUsers.map(u => u.id)

    const message = await Message.create({
      id: crypto.randomUUID(),
      channelId: channel.id,
      userId: user.id,
      content: data.content,
      mentions: mentionIds,
    })

    channel.lastActiveAt = DateTime.now()
    await channel.save()

    await message.load('user')

    // Broadcast message to all channel members via WebSocket
    await WebSocketService.broadcastChannelMessage(channelId, message, user)

    return response.created({
      message: {
        id: message.id,
        userId: message.userId,
        content: message.content,
        mentions: message.mentions || [],
        createdAt: message.createdAt.toMillis(),
        user: {
          id: message.user.id,
          username: message.user.username,
          firstName: message.user.firstName,
          lastName: message.user.lastName,
          fullName: message.user.fullName,
          avatar: message.user.avatar,
        },
      },
    })
  }

  /**
   * Delete a message (only message author)
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const message = await Message.find(params.id)

    if (!message) {
      return response.notFound({
        errors: [{ message: 'Message not found' }],
      })
    }

    if (message.userId !== user.id) {
      return response.forbidden({
        errors: [{ message: 'You can only delete your own messages' }],
      })
    }

    await message.delete()

    return response.ok({
      message: 'Message deleted successfully',
    })
  }
}
