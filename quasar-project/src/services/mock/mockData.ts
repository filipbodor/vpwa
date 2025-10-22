import type { User, Channel, DirectMessage, Message } from 'src/models'

export const CURRENT_USER_ID = 'user-1'

export const mockUsers: User[] = [
  { id: 'user-1', name: 'You', email: 'you@example.com', avatar: '👤', status: 'online' },
  { id: 'user-2', name: 'Alice Johnson', email: 'alice@example.com', avatar: '👩', status: 'online' },
  { id: 'user-3', name: 'Bob Smith', email: 'bob@example.com', avatar: '👨', status: 'away' },
  { id: 'user-4', name: 'Charlie Brown', email: 'charlie@example.com', avatar: '🧑', status: 'busy' },
  { id: 'user-5', name: 'Diana Prince', email: 'diana@example.com', avatar: '👸', status: 'offline' },
]

export const mockChannels: Channel[] = [
  {
    id: 'channel-1',
    name: 'general',
    description: 'General discussion',
    isPrivate: false,
    ownerId: 'user-1',
    memberIds: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
    lastActiveAt: Date.now() - 300000,
  },
  {
    id: 'channel-2',
    name: 'random',
    description: 'Random chat',
    isPrivate: false,
    ownerId: 'user-2',
    memberIds: ['user-1', 'user-2', 'user-3'],
    lastActiveAt: Date.now() - 3600000,
  },
  {
    id: 'channel-3',
    name: 'team-alpha',
    description: 'Team Alpha private',
    isPrivate: true,
    ownerId: 'user-1',
    memberIds: ['user-1', 'user-2'],
    lastActiveAt: Date.now() - 1800000,
  },
]

export const mockDirectMessages: DirectMessage[] = [
  { id: 'dm-1', userId: 'user-2', lastMessageAt: Date.now() - 600000 },
  { id: 'dm-2', userId: 'user-3', lastMessageAt: Date.now() - 7200000 },
]

export const mockMessages: Record<string, Message[]> = {
  'channel:channel-1': [
    { id: 'msg-1', senderId: 'user-2', text: 'Hey everyone! 👋', createdAt: Date.now() - 3600000 },
    { id: 'msg-2', senderId: 'user-1', text: 'Hi Alice! How are you?', createdAt: Date.now() - 3300000 },
    { id: 'msg-3', senderId: 'user-2', text: "I'm doing great!", createdAt: Date.now() - 3000000 },
    { id: 'msg-4', senderId: 'user-3', text: 'Nice work Alice! 🎉', createdAt: Date.now() - 2700000 },
    { id: 'msg-5', senderId: 'user-1', text: 'Awesome! Can you show us a demo later?', createdAt: Date.now() - 2400000 },
  ],
  'channel:channel-2': [
    { id: 'msg-6', senderId: 'user-3', text: 'Anyone up for lunch? 🍕', createdAt: Date.now() - 5400000 },
    { id: 'msg-7', senderId: 'user-2', text: 'Sure! Where are we going?', createdAt: Date.now() - 5100000 },
  ],
  'channel:channel-3': [
    { id: 'msg-8', senderId: 'user-1', text: 'This is a private team channel', createdAt: Date.now() - 7200000 },
  ],
  'dm:dm-1': [
    { id: 'msg-9', senderId: 'user-2', text: 'Hey! Quick question', createdAt: Date.now() - 1800000 },
    { id: 'msg-10', senderId: 'user-1', text: 'Sure, what do you need?', createdAt: Date.now() - 1680000 },
    { id: 'msg-11', senderId: 'user-2', text: 'Can you review my PR?', createdAt: Date.now() - 1500000 },
    { id: 'msg-12', senderId: 'user-1', text: 'Of course! Will do.', createdAt: Date.now() - 1200000 },
  ],
  'dm:dm-2': [
    { id: 'msg-13', senderId: 'user-3', text: 'Thanks for yesterday!', createdAt: Date.now() - 8400000 },
    { id: 'msg-14', senderId: 'user-1', text: 'No problem!', createdAt: Date.now() - 7800000 },
  ],
}

