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

  static async broadcastTyping(channelId: string, userId: string, username: string, isTyping: boolean, text?: string) {
    const payload = {
      type: 'typing',
      channelId,
      userId,
      username,
      isTyping,
      text: text || '',
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

  static async broadcastChannelMemberAdded(channelId: string, user: { id: string, username: string, firstName: string, lastName: string, fullName: string, avatar?: string, status: string }) {
    const payload = {
      type: 'channel_member_added',
      channelId,
      user,
    }

    const channelName = `channels/${channelId}`
    transmit.broadcast(channelName, payload)
  }

  static async broadcastChannelMemberRemoved(channelId: string, userId: string) {
    const payload = {
      type: 'channel_member_removed',
      channelId,
      userId,
    }

    const channelName = `channels/${channelId}`
    transmit.broadcast(channelName, payload)
    
    const userChannel = `users/${userId}`
    transmit.broadcast(userChannel, payload)
  }

  static async broadcastUserInvited(channelId: string, userId: string, channelName: string, invitedBy: string) {
    const payload = {
      type: 'channel_invited',
      channelId,
      channelName,
      invitedBy,
    }

    const userChannel = `users/${userId}`
    transmit.broadcast(userChannel, payload)
  }
  static async broadcastChannelDeleted(channelId: string, memberIds: string[]) {
    const payload = {
      type: 'channel_deleted',
      channelId,
    }

    for (const userId of memberIds) {
      const userChannel = `users/${userId}`
      transmit.broadcast(userChannel, payload)
    }
  }
}

