import type { Channel } from 'src/models'
import { mockChannels, CURRENT_USER_ID } from '../mock/mockData'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const channelService = {
  async getMyChannels(): Promise<Channel[]> {
    await delay(100)
    return mockChannels.filter(ch => ch.memberIds.includes(CURRENT_USER_ID))
  },

  async getChannelById(id: string): Promise<Channel | null> {
    await delay(50)
    return mockChannels.find(ch => ch.id === id) || null
  },

  async createChannel(data: { name: string; description?: string; isPrivate: boolean }): Promise<Channel> {
    await delay(200)
    const newChannel: Channel = {
      id: `channel-${Date.now()}`,
      name: data.name,
      ...(data.description ? { description: data.description } : {}),
      isPrivate: data.isPrivate,
      ownerId: CURRENT_USER_ID,
      memberIds: [CURRENT_USER_ID],
      lastActiveAt: Date.now(),
    }
    mockChannels.push(newChannel)
    return newChannel
  },

  async joinChannel(channelId: string): Promise<void> {
    await delay(150)
    const channel = mockChannels.find(ch => ch.id === channelId)
    if (channel && !channel.memberIds.includes(CURRENT_USER_ID)) {
      channel.memberIds.push(CURRENT_USER_ID)
    }
  },

  async leaveChannel(channelId: string): Promise<void> {
    await delay(150)
    const channel = mockChannels.find(ch => ch.id === channelId)
    if (channel) {
      channel.memberIds = channel.memberIds.filter(id => id !== CURRENT_USER_ID)
    }
  },

  async deleteChannel(channelId: string): Promise<void> {
    await delay(150)
    const index = mockChannels.findIndex(ch => ch.id === channelId)
    if (index !== -1) mockChannels.splice(index, 1)
  },

  async inviteUser(channelId: string, userId: string): Promise<void> {
    await delay(100)
    const channel = mockChannels.find(ch => ch.id === channelId)
    if (channel && !channel.memberIds.includes(userId)) {
      channel.memberIds.push(userId)
    }
  },

  async removeUser(channelId: string, userId: string): Promise<void> {
    await delay(100)
    const channel = mockChannels.find(ch => ch.id === channelId)
    if (channel) {
      channel.memberIds = channel.memberIds.filter(id => id !== userId)
    }
  },
}

