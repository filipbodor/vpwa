import type { HttpContext } from '@adonisjs/core/http'
import DirectMessage from '#models/direct_message'
import Message from '#models/message'
import User from '#models/user'
import { DateTime } from 'luxon'
import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'

const createOrGetDMValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid(),
  })
)

const sendMessageValidator = vine.compile(
  vine.object({
    content: vine.string().minLength(1).maxLength(5000).trim(),
  })
)

export default class DirectMessagesController {
  /**
   * Get all DM conversations for current user
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!

    const dms = await DirectMessage.query()
      .where('user1_id', user.id)
      .orWhere('user2_id', user.id)
      .preload('user1')
      .preload('user2')
      .orderBy('last_message_at', 'desc')

    return response.ok({
      directMessages: dms
        .filter((dm) => dm.user1Id !== dm.user2Id) // Extra safety: filter out self-DMs
        .map((dm) => {
          const otherUser = dm.user1Id === user.id ? dm.user2 : dm.user1
          return {
            id: dm.id,
            userId: otherUser.id,
            userName: otherUser.fullName,
            userUsername: otherUser.username,
            userAvatar: otherUser.avatar,
            userStatus: otherUser.status,
            lastMessageAt: dm.lastMessageAt?.toMillis() || null,
          }
        }),
    })
  }

  /**
   * Create or get existing DM conversation
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createOrGetDMValidator)

    if (data.userId === user.id) {
      return response.badRequest({
        errors: [{ message: 'Cannot create DM with yourself' }],
      })
    }

    const otherUser = await User.find(data.userId)
    if (!otherUser) {
      return response.notFound({
        errors: [{ message: 'User not found' }],
      })
    }

    // Ensure consistent ordering: user1_id < user2_id
    const [user1Id, user2Id] = [user.id, data.userId].sort()

    // Try to find existing DM
    let dm = await DirectMessage.query()
      .where('user1_id', user1Id)
      .where('user2_id', user2Id)
      .first()

    if (!dm) {
      dm = await DirectMessage.create({
        id: crypto.randomUUID(),
        user1Id,
        user2Id,
      })
    }

    await dm.load('user1')
    await dm.load('user2')

    const otherUserData = dm.user1Id === user.id ? dm.user2 : dm.user1

    return response.ok({
      directMessage: {
        id: dm.id,
        userId: otherUserData.id,
        userName: otherUserData.fullName,
        userUsername: otherUserData.username,
        userAvatar: otherUserData.avatar,
        userStatus: otherUserData.status,
        lastMessageAt: dm.lastMessageAt?.toMillis() || null,
      },
    })
  }

  /**
   * Get messages for a DM conversation
   */
  async messages({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const dmId = params.id
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)

    const dm = await DirectMessage.find(dmId)
    if (!dm) {
      return response.notFound({
        errors: [{ message: 'Direct message conversation not found' }],
      })
    }

    // Check if user is part of this DM
    if (dm.user1Id !== user.id && dm.user2Id !== user.id) {
      return response.forbidden({
        errors: [{ message: 'You are not part of this conversation' }],
      })
    }

    const messages = await Message.query()
      .where('direct_message_id', dmId)
      .preload('user')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    return response.ok({
      messages: messages.all().reverse().map((msg) => ({
        id: msg.id,
        userId: msg.userId,
        content: msg.content,
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
   * Send message in a DM conversation
   */
  async sendMessage({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const dmId = params.id
    const data = await request.validateUsing(sendMessageValidator)

    const dm = await DirectMessage.find(dmId)
    if (!dm) {
      return response.notFound({
        errors: [{ message: 'Direct message conversation not found' }],
      })
    }

    // Check if user is part of this DM
    if (dm.user1Id !== user.id && dm.user2Id !== user.id) {
      return response.forbidden({
        errors: [{ message: 'You are not part of this conversation' }],
      })
    }

    const message = await Message.create({
      id: crypto.randomUUID(),
      directMessageId: dm.id,
      userId: user.id,
      content: data.content,
    })

    // Update DM last message time
    dm.lastMessageAt = DateTime.now()
    await dm.save()

    await message.load('user')

    return response.created({
      message: {
        id: message.id,
        userId: message.userId,
        content: message.content,
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
}
