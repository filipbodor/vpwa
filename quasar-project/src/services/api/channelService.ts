import type { Channel } from 'src/models'
import { apiClient } from './apiClient'

interface ChannelResponse {
  channel: {
    id: string
    name: string
    description?: string
    isPrivate: boolean
    ownerId: string
    lastActiveAt: number
    memberCount: number
    memberIds: string[]
    isNewInvite?: boolean
  }
}

interface ChannelsResponse {
  channels: Array<{
    id: string
    name: string
    description?: string
    isPrivate: boolean
    ownerId: string
    lastActiveAt: number
    memberCount: number
    memberIds: string[]
    isNewInvite?: boolean
  }>
}

export const channelService = {
  async getMyChannels(): Promise<Channel[]> {
    const { data } = await apiClient.get<ChannelsResponse>('/channels')
    return data.channels.map(ch => ({
      id: ch.id,
      name: ch.name,
      ...(ch.description && { description: ch.description }),
      isPrivate: ch.isPrivate,
      ownerId: ch.ownerId,
      memberIds: ch.memberIds,
      lastActiveAt: ch.lastActiveAt,
      ...(ch.isNewInvite && { isNewInvite: ch.isNewInvite }),
    }))
  },

  async getPublicChannels(): Promise<Channel[]> {
    const { data } = await apiClient.get<ChannelsResponse>('/channels/public')
    return data.channels.map(ch => ({
      id: ch.id,
      name: ch.name,
      ...(ch.description && { description: ch.description }),
      isPrivate: ch.isPrivate,
      ownerId: ch.ownerId,
      memberIds: ch.memberIds,
      lastActiveAt: ch.lastActiveAt,
    }))
  },

  async getChannelById(id: string): Promise<Channel | null> {
    try {
      const { data } = await apiClient.get<ChannelResponse>(`/channels/${id}`)
      return {
        id: data.channel.id,
        name: data.channel.name,
        ...(data.channel.description && { description: data.channel.description }),
        isPrivate: data.channel.isPrivate,
        ownerId: data.channel.ownerId,
        memberIds: data.channel.memberIds,
        lastActiveAt: data.channel.lastActiveAt,
      }
    } catch (error) {
      return null
    }
  },

  async createChannel(data: { name: string; description?: string; isPrivate: boolean }): Promise<Channel> {
    const response = await apiClient.post<ChannelResponse>('/channels', data)
    const ch = response.data.channel
    return {
      id: ch.id,
      name: ch.name,
      ...(ch.description && { description: ch.description }),
      isPrivate: ch.isPrivate,
      ownerId: ch.ownerId,
      memberIds: ch.memberIds,
      lastActiveAt: ch.lastActiveAt,
    }
  },

  async joinChannel(channelId: string): Promise<void> {
    await apiClient.post(`/channels/${channelId}/join`)
  },

  async leaveChannel(channelId: string): Promise<void> {
    await apiClient.post(`/channels/${channelId}/leave`)
  },

  async deleteChannel(channelId: string): Promise<void> {
    await apiClient.delete(`/channels/${channelId}`)
  },

  async inviteUser(channelId: string, userId: string): Promise<void> {
    await apiClient.post(`/channels/${channelId}/invite`, { userId })
  },

  async removeUser(channelId: string, userId: string): Promise<void> {
    await apiClient.post(`/channels/${channelId}/kick`, { userId })
  },

  async clearInviteFlag(channelId: string): Promise<void> {
    await apiClient.post(`/channels/${channelId}/clear-invite`)
  },
}

