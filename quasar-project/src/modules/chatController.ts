import type { Channel } from 'src/models/Channel'
import type { DirectMessage } from 'src/models/DirectMessage'
import { ref, computed } from 'vue'

export type ChatKind = 'channel' | 'dm'
export type MessageModel = { id: string; sender: string; text: string; createdAt: number }
export type ThreadId = { kind: ChatKind; id: string }

const currentUserId = 'me'

const channels = ref<Channel[]>([
  { id: 'general', name: 'general', description: 'General chat', isPrivate: false, ownerId: currentUserId, members: [currentUserId], lastActiveAt: Date.now() },
  { id: 'team', name: 'team', description: 'Team chat', isPrivate: false, ownerId: currentUserId, members: [currentUserId], invited: true, lastActiveAt: Date.now() - 3_600_000 },
])

const dms = ref<DirectMessage[]>([
  { id: 'dm-alice', name: 'Alice', last_message: 'Hey there!', icon: 'face' },
  { id: 'dm-bob', name: 'Bob', last_message: 'Hello!' },
])

const messagesByThread = ref<Record<string, MessageModel[]>>({
  'channel:general': [{ id: 'm1', sender: 'Alice', text: 'Hello', createdAt: Date.now() - 60_000 }],
  'dm:dm-alice': [{ id: 'm2', sender: 'Alice', text: 'Hi!', createdAt: Date.now() - 120_000 }],
})

const activeThread = ref<ThreadId | null>({ kind: 'channel', id: 'general' })

function threadKey(t: ThreadId) { return `${t.kind}:${t.id}` }

export function useChatController() {
  const channelViews = channels;

  const dmViews = dms;

  const activeMessages = computed<MessageModel[]>(() => {
    if (!activeThread.value) return []
    return messagesByThread.value[threadKey(activeThread.value)] || []
  })

  function openChannel(id: string) { activeThread.value = { kind: 'channel', id } }
  function openDM(id: string) { activeThread.value = { kind: 'dm', id } }

  function createChannel(payload: { name: string; description?: string | undefined; isPrivate?: boolean | undefined }) {
    const id = payload.name
    const ch: Channel = {
      id,
      name: payload.name,
      description: payload.description ?? undefined,
      isPrivate: !!payload.isPrivate,
      ownerId: currentUserId,
      members: [currentUserId],
      invited: undefined,
      lastActiveAt: Date.now(),
    }
    channels.value.unshift(ch)
  }

  function leaveChannel(id: string) {
    channels.value = channels.value.filter(c => c.id !== id)
  }

  function deleteChannel(id: string) {
    channels.value = channels.value.filter(c => c.id !== id)
  }

  function sendMessage(text: string) {
    if (!activeThread.value) return
    const key = threadKey(activeThread.value)
    const list = messagesByThread.value[key] || (messagesByThread.value[key] = [])
    list.push({ id: Math.random().toString(36).slice(2, 9), sender: 'me', text, createdAt: Date.now() })
  }

  return { channelViews, dmViews, activeMessages, activeThread, openChannel, openDM, createChannel, leaveChannel, deleteChannel, sendMessage }
}


