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
    // Repeating / new messages
    { id: 'msg-15', senderId: 'user-2', text: 'Let’s start with the presentation.', createdAt: Date.now() - 2300000 },
    { id: 'msg-16', senderId: 'user-3', text: 'Sure, I’ll set up the slides.', createdAt: Date.now() - 2200000 },
    { id: 'msg-17', senderId: 'user-1', text: 'Great! I am excited.', createdAt: Date.now() - 2100000 },
    { id: 'msg-18', senderId: 'user-2', text: 'Remember to check the demo link.', createdAt: Date.now() - 2000000 },
    { id: 'msg-19', senderId: 'user-3', text: 'I’ve tested it, works fine.', createdAt: Date.now() - 1900000 },
    { id: 'msg-20', senderId: 'user-1', text: 'Thanks! Let’s begin.', createdAt: Date.now() - 1800000 },
    { id: 'msg-21', senderId: 'user-2', text: 'Hey everyone! 👋', createdAt: Date.now() - 1700000 },
    { id: 'msg-22', senderId: 'user-3', text: 'Hi Alice! How are you?', createdAt: Date.now() - 1600000 },
    { id: 'msg-23', senderId: 'user-1', text: "I'm doing great!", createdAt: Date.now() - 1500000 },
    { id: 'msg-24', senderId: 'user-2', text: 'Nice work Alice! 🎉', createdAt: Date.now() - 1400000 },
    { id: 'msg-25', senderId: 'user-3', text: 'Awesome! Can you show us a demo later?', createdAt: Date.now() - 1300000 },
    { id: 'msg-26', senderId: 'user-1', text: 'Let’s start with the presentation.', createdAt: Date.now() - 1200000 },
    { id: 'msg-27', senderId: 'user-2', text: 'Sure, I’ll set up the slides.', createdAt: Date.now() - 1100000 },
    { id: 'msg-28', senderId: 'user-3', text: 'Great! I am excited.', createdAt: Date.now() - 1000000 },
    { id: 'msg-29', senderId: 'user-1', text: 'Remember to check the demo link.', createdAt: Date.now() - 900000 },
    { id: 'msg-30', senderId: 'user-2', text: 'I’ve tested it, works fine.', createdAt: Date.now() - 800000 },
    { id: 'msg-31', senderId: 'user-3', text: 'Thanks! Let’s begin.', createdAt: Date.now() - 700000 },
    { id: 'msg-32', senderId: 'user-1', text: 'Hey everyone! 👋', createdAt: Date.now() - 600000 },
    { id: 'msg-33', senderId: 'user-2', text: 'Hi Alice! How are you?', createdAt: Date.now() - 500000 },
    { id: 'msg-34', senderId: 'user-3', text: "I'm doing great!", createdAt: Date.now() - 400000 },
    { id: 'msg-35', senderId: 'user-1', text: 'Nice work Alice! 🎉', createdAt: Date.now() - 300000 },
    { id: 'msg-36', senderId: 'user-2', text: 'Awesome! Can you show us a demo later?', createdAt: Date.now() - 200000 },
    { id: 'msg-37', senderId: 'user-3', text: 'Let’s start with the presentation.', createdAt: Date.now() - 100000 },
    { id: 'msg-38', senderId: 'user-1', text: 'Sure, I’ll set up the slides.', createdAt: Date.now() - 50000 },
    { id: 'msg-39', senderId: 'user-2', text: 'Great! I am excited.', createdAt: Date.now() - 40000 },
    { id: 'msg-40', senderId: 'user-3', text: 'Remember to check the demo link.', createdAt: Date.now() - 30000 },
    { id: 'msg-41', senderId: 'user-1', text: 'I’ve tested it, works fine.', createdAt: Date.now() - 20000 },
    { id: 'msg-42', senderId: 'user-2', text: 'Thanks! Let’s begin.', createdAt: Date.now() - 10000 },
    { id: 'msg-43', senderId: 'user-3', text: 'Hey everyone! 👋', createdAt: Date.now() - 9000 },
    { id: 'msg-44', senderId: 'user-1', text: 'Hi Alice! How are you?', createdAt: Date.now() - 8000 },
    { id: 'msg-45', senderId: 'user-2', text: "I'm doing great!", createdAt: Date.now() - 7000 },
    { id: 'msg-46', senderId: 'user-3', text: 'Nice work Alice! 🎉', createdAt: Date.now() - 6000 },
    { id: 'msg-47', senderId: 'user-1', text: 'Awesome! Can you show us a demo later?', createdAt: Date.now() - 5000 },
    { id: 'msg-48', senderId: 'user-2', text: 'Let’s start with the presentation.', createdAt: Date.now() - 4000 },
    { id: 'msg-49', senderId: 'user-3', text: 'Sure, I’ll set up the slides.', createdAt: Date.now() - 3000 },
    { id: 'msg-50', senderId: 'user-1', text: 'Great! I am excited.', createdAt: Date.now() - 2000 },
    { id: 'msg-51', senderId: 'user-2', text: 'Remember to check the demo link.', createdAt: Date.now() - 1000 },
    { id: 'msg-52', senderId: 'user-3', text: 'I’ve tested it, works fine.', createdAt: Date.now() - 500 },
    { id: 'msg-53', senderId: 'user-1', text: 'Thanks! Let’s begin.', createdAt: Date.now() - 400 },
    { id: 'msg-54', senderId: 'user-2', text: 'Hey everyone! 👋', createdAt: Date.now() - 300 },
    { id: 'msg-55', senderId: 'user-3', text: 'Hi Alice! How are you?', createdAt: Date.now() - 200 },
    { id: 'msg-56', senderId: 'user-1', text: "I'm doing great!", createdAt: Date.now() - 100 },
    { id: 'msg-57', senderId: 'user-2', text: 'Nice work Alice! 🎉', createdAt: Date.now() },
    { id: 'msg-58', senderId: 'user-3', text: 'Awesome! Can you show us a demo later?', createdAt: Date.now() + 100 },
    { id: 'msg-59', senderId: 'user-1', text: 'Let’s start with the presentation.', createdAt: Date.now() + 200 },
    { id: 'msg-60', senderId: 'user-2', text: 'Sure, I’ll set up the slides.', createdAt: Date.now() + 300 },
  ],
  // You can similarly expand channel-2, channel-3, dm-1, dm-2 with repeated / shuffled messages
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

