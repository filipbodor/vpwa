import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Channel } from 'src/models'
import { channelService } from 'src/services/api'

export const useChannelStore = defineStore('channels', () => {
  const channels = ref<Map<string, Channel>>(new Map())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const channelList = computed(() => {
    // Sort channels: new invites first, then by last active
    return Array.from(channels.value.values()).sort((a, b) => {
      // New invites go to top
      if (a.isNewInvite && !b.isNewInvite) return -1
      if (!a.isNewInvite && b.isNewInvite) return 1
      // Otherwise sort by last active
      return b.lastActiveAt - a.lastActiveAt
    })
  })
  const publicChannels = computed(() => channelList.value.filter(ch => !ch.isPrivate))
  const privateChannels = computed(() => channelList.value.filter(ch => ch.isPrivate))
  const newInviteChannels = computed(() => channelList.value.filter(ch => ch.isNewInvite))

  async function fetchMyChannels() {
    isLoading.value = true
    error.value = null
    try {
      const { channels: channelList, users } = await channelService.getMyChannels()
      channels.value.clear()
      channelList.forEach(channel => channels.value.set(channel.id, channel))
      
      const { useUserStore } = await import('./userStore')
      const userStore = useUserStore()
      userStore.addUsers(users as any)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch channels'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPublicChannels(): Promise<Channel[]> {
    try {
      return await channelService.getPublicChannels()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch public channels'
      return []
    }
  }

  async function fetchChannelById(channelId: string) {
    if (channels.value.has(channelId)) return channels.value.get(channelId)!
    try {
      const channel = await channelService.getChannelById(channelId)
      if (channel) channels.value.set(channelId, channel)
      return channel
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch channel'
      throw e
    }
  }

  async function createChannel(data: { name: string; description?: string; isPrivate: boolean }) {
    isLoading.value = true
    error.value = null
    try {
      const { channel: newChannel, users } = await channelService.createChannel(data)
      channels.value.set(newChannel.id, newChannel)
      
      const { useUserStore } = await import('./userStore')
      const userStore = useUserStore()
      userStore.addUsers(users as any)
      
      return newChannel
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create channel'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function joinChannel(channelId: string) {
    try {
      await channelService.joinChannel(channelId)
      await fetchChannelById(channelId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to join channel'
      throw e
    }
  }

  async function leaveChannel(channelId: string) {
    try {
      await channelService.leaveChannel(channelId)
      channels.value.delete(channelId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to leave channel'
      throw e
    }
  }

  async function deleteChannel(channelId: string) {
    try {
      await channelService.deleteChannel(channelId)
      channels.value.delete(channelId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete channel'
      throw e
    }
  }

  async function inviteUser(channelId: string, userId: string) {
    try {
      await channelService.inviteUser(channelId, userId)
      await fetchChannelById(channelId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to invite user'
      throw e
    }
  }

  async function removeUser(channelId: string, userId: string) {
    try {
      await channelService.removeUser(channelId, userId)
      await fetchChannelById(channelId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to remove user'
      throw e
    }
  }

  async function voteKick(channelId: string, userId: string): Promise<{ message: string; votes: number }> {
    try {
      const result = await channelService.voteKick(channelId, userId)
      await fetchChannelById(channelId)
      return result
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to vote kick user'
      throw e
    }
  }

  function getChannelById(channelId: string): Channel | undefined {
    return channels.value.get(channelId)
  }

  function findChannelByName(name: string): Channel | undefined {
    return channelList.value.find(ch => ch.name === name)
  }

  async function clearInviteFlag(channelId: string) {
    try {
      await channelService.clearInviteFlag(channelId)
      const channel = channels.value.get(channelId)
      if (channel) {
        channels.value.set(channelId, { ...channel, isNewInvite: false })
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to clear invite flag'
      throw e
    }
  }

  function removeChannelFromStore(channelId: string) {
    channels.value.delete(channelId)
  }

  return {
    channels, isLoading, error, channelList, publicChannels, privateChannels, newInviteChannels,
    fetchMyChannels, fetchPublicChannels, fetchChannelById, createChannel, joinChannel, leaveChannel,
    deleteChannel, inviteUser, removeUser, voteKick, getChannelById, findChannelByName, clearInviteFlag,
    removeChannelFromStore
  }
})

