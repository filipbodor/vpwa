import { useChatController } from 'src/modules/chatController'

export type CommandResult = { ok: true; message?: string } | { ok: false; error: string }

export function useCommandController() {
  const chat = useChatController()
  const voteKick = new Map<string, Set<string>>() // key: channel:name:targetId -> voterIds

  function parse(input: string) {
    const parts = input.trim().split(/\s+/)
    const cmd = parts[0]?.slice(1).toLowerCase()
    const args = parts.slice(1)
    return { cmd, args }
  }

  function handle(input: string): CommandResult {
    if (!input.startsWith('/')) return { ok: false, error: 'Not a command' }
    const { cmd, args } = parse(input)

    if (cmd === 'join') {
      const name = args[0]
      const isPrivate = (args[1] || '').toLowerCase() === 'private'
      if (!name) return { ok: false, error: 'Usage: /join channelName [private]' }
      let ch = chat.findChannelByName(name)
      if (!ch) {
        // create (public unless private explicitly requested)
        chat.createChannel({ name, isPrivate })
        ch = chat.findChannelByName(name)!
      }
      if (ch.isPrivate && !chat.isOwner(name, chat.currentUserId)) {
        return { ok: false, error: 'Private channel; only owner can invite' }
      }
      chat.addUserToChannel(name, chat.currentUserId)
      chat.openChannel(ch.id)
      return { ok: true, message: `Joined #${name}` }
    }

    if (cmd === 'invite') {
      const nickname = args[0]
      if (!nickname) return { ok: false, error: 'Usage: /invite nickName' }
      // require active channel
      const thr = chat.activeThread.value
      if (!thr || thr.kind !== 'channel') return { ok: false, error: 'Not in a channel' }
      const name = chat.findChannelByName(thr.id)?.name || thr.id
      const userId = chat.findUserIdByNickname(nickname)
      if (!userId) return { ok: false, error: 'User not found' }
      const ch = chat.findChannelByName(name)!
      if (ch.isPrivate && !chat.isOwner(name, chat.currentUserId)) return { ok: false, error: 'Only owner can invite to private channel' }
      chat.addUserToChannel(name, userId)
      return { ok: true, message: `Invited ${nickname}` }
    }

    if (cmd === 'revoke') {
      const nickname = args[0]
      if (!nickname) return { ok: false, error: 'Usage: /revoke nickName' }
      const thr = chat.activeThread.value
      if (!thr || thr.kind !== 'channel') return { ok: false, error: 'Not in a channel' }
      const name = chat.findChannelByName(thr.id)?.name || thr.id
      if (!chat.isOwner(name, chat.currentUserId)) return { ok: false, error: 'Only owner can revoke' }
      const userId = chat.findUserIdByNickname(nickname)
      if (!userId) return { ok: false, error: 'User not found' }
      chat.removeUserFromChannel(name, userId)
      return { ok: true, message: `Revoked ${nickname}` }
    }

    if (cmd === 'kick') {
      const nickname = args[0]
      if (!nickname) return { ok: false, error: 'Usage: /kick nickName' }
      const thr = chat.activeThread.value
      if (!thr || thr.kind !== 'channel') return { ok: false, error: 'Not in a channel' }
      const name = chat.findChannelByName(thr.id)?.name || thr.id
      const targetId = chat.findUserIdByNickname(nickname)
      if (!targetId) return { ok: false, error: 'User not found' }
      const ch = chat.findChannelByName(name)!
      const key = `${name}:${targetId}`
      if (chat.isOwner(name, chat.currentUserId)) {
        chat.removeUserFromChannel(name, targetId)
        return { ok: true, message: `Kicked ${nickname}` }
      }
      // member vote
      if (!ch.members.includes(chat.currentUserId)) return { ok: false, error: 'Not a member' }
      let voters = voteKick.get(key)
      if (!voters) voteKick.set(key, (voters = new Set()))
      voters.add(chat.currentUserId)
      if (voters.size >= 3) {
        chat.removeUserFromChannel(name, targetId)
        voteKick.delete(key)
        return { ok: true, message: `Banned ${nickname}` }
      }
      return { ok: true, message: `Kick vote added (${voters.size}/3)` }
    }

    if (cmd === 'close') {
      const thr = chat.activeThread.value
      if (!thr || thr.kind !== 'channel') return { ok: false, error: 'Not in a channel' }
      const name = chat.findChannelByName(thr.id)?.name || thr.id
      if (!chat.isOwner(name, chat.currentUserId)) return { ok: false, error: 'Only owner can close' }
      chat.deleteChannel(thr.id)
      return { ok: true, message: `Closed #${name}` }
    }

    return { ok: false, error: `Unknown command: ${cmd}` }
  }

  return { handle }
}


