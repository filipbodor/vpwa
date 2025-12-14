import type { Channel } from 'src/models'
import { apiClient } from './apiClient'

interface UserInfo {
  id: string
  username: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  status: 'online' | 'dnd' | 'offline'
}

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
    members?: UserInfo[]
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
    members?: UserInfo[]
    isNewInvite?: boolean
  }>
}

export const channelService = {
  async getMyChannels(): Promise<{ channels: Channel[], users: Array<{
    id: string
    username: string
    firstName: string
    lastName: string
    fullName: string
    avatar?: string
    status: 'online' | 'dnd' | 'offline'
  }> }> {
    const { data } = await apiClient.get<ChannelsResponse>('/channels')
    
    const allUsers: UserInfo[] = []
    data.channels.forEach(ch => {
      if (ch.members) {
        allUsers.push(...ch.members)
      }
    })
    
    const uniqueUsers = Array.from(
      new Map(allUsers.map(u => [u.id, u])).values()
    )
    
    const channels = data.channels.map(ch => ({
      id: ch.id,
      name: ch.name,
      ...(ch.description && { description: ch.description }),
      isPrivate: ch.isPrivate,
      ownerId: ch.ownerId,
      memberIds: ch.memberIds,
      lastActiveAt: ch.lastActiveAt,
      ...(ch.isNewInvite && { isNewInvite: ch.isNewInvite }),
    }))
    
    return { channels, users: uniqueUsers }
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

  async createChannel(data: { name: string; description?: string; isPrivate: boolean }): Promise<{ channel: Channel, users: UserInfo[] }> {
    const response = await apiClient.post<ChannelResponse>('/channels', data)
    const ch = response.data.channel
    
    const users = ch.members || []
    
    const channel: Channel = {
      id: ch.id,
      name: ch.name,
      ...(ch.description && { description: ch.description }),
      isPrivate: ch.isPrivate,
      ownerId: ch.ownerId,
      memberIds: ch.memberIds,
      lastActiveAt: ch.lastActiveAt,
    }
    
    return { channel, users }
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

  async voteKick(channelId: string, userId: string): Promise<{ message: string; votes: number }> {
    const { data } = await apiClient.post<{ message: string; votes: number }>(`/channels/${channelId}/vote-kick`, { userId })
    return data
  },

  async clearInviteFlag(channelId: string): Promise<void> {
    await apiClient.post(`/channels/${channelId}/clear-invite`)
  },
}

