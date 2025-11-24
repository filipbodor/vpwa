import transmit from '@adonisjs/transmit/services/main'
import type User from '#models/user'
import type Message from '#models/message'

export class WebSocketService {
  static async broadcastChannelMessage(channelId: string, message: Message, sender: User) {
    const payload = {
      type: 'channel_message',
      channelId,
      message: {
        id: message.id,
        content: message.content,
        mentions: message.mentions || [],
        createdAt: message.createdAt.toMillis(),
        senderId: sender.id,
        sender: {
          id: sender.id,
          username: sender.username,
          firstName: sender.firstName,
          lastName: sender.lastName,
          fullName: sender.fullName,
          avatar: sender.avatar,
          status: sender.status,
        },
      },
    }

    const channelName = `channels/${channelId}`
    transmit.broadcast(channelName, payload)
  }

  static async broadcastDirectMessage(dmId: string, message: Message, sender: User, recipientId: string) {
    const payload = {
      type: 'direct_message',
      directMessageId: dmId,
      message: {
        id: message.id,
        content: message.content,
        mentions: message.mentions || [],
        createdAt: message.createdAt.toMillis(),
        senderId: sender.id,
        sender: {
          id: sender.id,
          username: sender.username,
          firstName: sender.firstName,
          lastName: sender.lastName,
          fullName: sender.fullName,
          avatar: sender.avatar,
          status: sender.status,
        },
      },
    }

    const senderChannel = `users/${sender.id}`
    const recipientChannel = `users/${recipientId}`
    transmit.broadcast(senderChannel, payload)
    transmit.broadcast(recipientChannel, payload)
  }

  static async broadcastStatusChange(userId: string, status: 'online' | 'dnd' | 'offline') {
    const payload = {
      type: 'status_change',
      userId,
      status,
      timestamp: Date.now(),
    }

    transmit.broadcast('global', payload)
  }

  static async broadcastTyping(channelId: string, user: User, isTyping: boolean) {
    const payload = {
      type: 'typing',
      channelId,
      userId: user.id,
      username: user.username,
      isTyping,
    }

    const channelName = `channels/${channelId}`
    transmit.broadcast(channelName, payload)
  }

  static async sendNotificationToUser(
    userId: string,
    notification: {
      type: 'notification'
      title: string
      body: string
      avatar?: string
      channelId?: string
      directMessageId?: string
    }
  ) {
    const userChannel = `users/${userId}`
    transmit.broadcast(userChannel, notification)
  }
}

