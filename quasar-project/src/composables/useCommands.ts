import { useAuthStore, useChannelStore, useChatStore, useUserStore } from 'src/stores/pinia-stores'

export function useCommands() {
  const authStore = useAuthStore()
  const channelStore = useChannelStore()
  const chatStore = useChatStore()
  const userStore = useUserStore()
  
  const getCurrentUserId = () => authStore.currentUserId
  const getActiveThread = () => chatStore.activeThread
  const findChannelByName = (name: string) => channelStore.findChannelByName(name)
  const findUserByUsername = (username: string) => userStore.findUserByUsername(username)
  const getActiveChannelInfo = () => {
    const thread = chatStore.activeThread
    if (!thread || thread.type !== 'channel') return null
    const channel = channelStore.getChannelById(thread.id)
    if (!channel) return null
    return {
      ...channel,
      isOwner: channel.ownerId === authStore.currentUserId
    }
  }

  const voteKicks = new Map<string, Set<string>>()

  function parseCommand(input: string) {
    const parts = input.trim().split(/\s+/)
    const command = parts[0]?.slice(1).toLowerCase()
    const args = parts.slice(1)
    return { command, args }
  }

  async function handleCommand(input: string): Promise<{ success: boolean; message?: string; error?: string; data?: any }> {
    if (!input.startsWith('/')) {
      return { success: false, error: 'Not a command' }
    }

    const { command, args } = parseCommand(input)
    const activeThread = getActiveThread()

    try {
      switch (command) {
        case 'join': {
          const channelName = args[0]
          const isPrivate = args[1]?.toLowerCase() === 'private'

          if (!channelName) {
            return { success: false, error: 'Usage: /join <channel-name> [private]' }
          }

          let channel = findChannelByName(channelName)
          if (!channel) {
            channel = await channelStore.createChannel({ name: channelName, isPrivate })
          }
          chatStore.openChannel(channel.id)
          return { success: true, message: `Joined #${channelName}` }
        }

        case 'invite': {
          const username = args[0]
          if (!username) {
            return { success: false, error: 'Usage: /invite <username>' }
          }

          if (!activeThread || activeThread.type !== 'channel') {
            return { success: false, error: 'You must be in a channel to invite users' }
          }

          const user = findUserByUsername(username)
          if (!user) {
            return { success: false, error: `User "@${username}" not found` }
          }

          const channelInfo = getActiveChannelInfo()
          if (!channelInfo) {
            return { success: false, error: 'Channel not found' }
          }

          if (channelInfo.isPrivate && !channelInfo.isOwner) {
            return { success: false, error: 'Only the channel owner can invite users to private channels' }
          }

          await channelStore.inviteUser(activeThread.id, user.id)
          return { success: true, message: `Invited @${username} to the channel` }
        }

        case 'revoke':
        case 'kick': {
          const username = args[0]
          if (!username) {
            return { success: false, error: `Usage: /${command} <username>` }
          }

          if (!activeThread || activeThread.type !== 'channel') {
            return { success: false, error: 'You must be in a channel to remove users' }
          }

          const user = findUserByUsername(username)
          if (!user) {
            return { success: false, error: `User "@${username}" not found` }
          }

          const channelInfo = getActiveChannelInfo()
          if (!channelInfo) {
            return { success: false, error: 'Channel not found' }
          }

          if (command === 'revoke' || channelInfo.isOwner) {
            if (!channelInfo.isOwner) {
              return { success: false, error: 'Only the channel owner can revoke users' }
            }
            await channelStore.removeUser(activeThread.id, user.id)
            return { success: true, message: `Removed @${username} from the channel` }
          } else {
            const voteKey = `${activeThread.id}:${user.id}`
            let votes = voteKicks.get(voteKey)
            if (!votes) {
              votes = new Set()
              voteKicks.set(voteKey, votes)
            }

            votes.add(getCurrentUserId())

            if (votes.size >= 3) {
              await channelStore.removeUser(activeThread.id, user.id)
              voteKicks.delete(voteKey)
              return { success: true, message: `@${username} has been kicked from the channel` }
            } else {
              return { success: true, message: `Vote recorded (${votes.size}/3 votes to kick)` }
            }
          }
        }

        case 'close':
        case 'delete': {
          if (!activeThread || activeThread.type !== 'channel') {
            return { success: false, error: 'You must be in a channel to delete it' }
          }

          const channelInfo = getActiveChannelInfo()
          if (!channelInfo) {
            return { success: false, error: 'Channel not found' }
          }

          if (!channelInfo.isOwner) {
            return { success: false, error: 'Only the channel owner can delete the channel' }
          }

          await channelStore.deleteChannel(activeThread.id)
          return { success: true, message: `Channel #${channelInfo.name} has been deleted` }
        }

        case 'list': {
          if (!activeThread || activeThread.type !== 'channel') {
            return { success: false, error: 'You must be in a channel to list members' }
          }

          const channelInfo = getActiveChannelInfo()
          if (!channelInfo) {
            return { success: false, error: 'Channel not found' }
          }

          return { success: true, message: 'list_members', data: { channelId: activeThread.id } }
        }

        case 'help': {
          const helpMessage = `
Available commands:
/join <channel> [private] - Join or create a channel
/invite <username> - Invite a user to the current channel
/kick <username> - Vote to kick a user (3 votes required) or remove immediately if owner
/revoke <username> - Remove a user from the channel (owner only)
/delete - Delete the current channel (owner only)
/list - Show channel members list
/help - Show this help message
          `.trim()
          return { success: true, message: helpMessage }
        }

        default: {
          return { success: false, error: `Unknown command: /${command}. Type /help for available commands` }
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Command failed' 
      }
    }
  }

  return {
    handleCommand,
  }
}

