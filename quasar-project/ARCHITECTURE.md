# Architecture Overview

This document describes the layered architecture of the Slack-like chat application.

## Layer Structure

The application follows a clear separation of concerns with the following layers:

```
┌─────────────────────────────────┐
│       Components (Vue)          │  ← User Interface
├─────────────────────────────────┤
│       Composables               │  ← Business Logic
├─────────────────────────────────┤
│       Stores (Pinia)            │  ← State Management
├─────────────────────────────────┤
│       Services (API)            │  ← Data Access
├─────────────────────────────────┤
│       Models (Types)            │  ← Data Structures
└─────────────────────────────────┘
```

## Directory Structure

```
src/
├── models/              # TypeScript interfaces and types
│   ├── User.ts          # User model and UserStatus type
│   ├── Message.ts       # Message model
│   ├── Channel.ts       # Channel model
│   ├── DirectMessage.ts # DirectMessage model
│   └── index.ts         # Exports all models + Thread types
│
├── services/
│   ├── mock/
│   │   └── mockData.ts  # Mock data for development
│   └── api/
│       ├── userService.ts     # User-related API calls
│       ├── channelService.ts  # Channel-related API calls
│       ├── messageService.ts  # Message-related API calls
│       └── index.ts           # Exports all services
│
├── stores/              # Pinia stores for state management
│   ├── authStore.ts     # Current user & authentication
│   ├── userStore.ts     # All users data
│   ├── channelStore.ts  # Channels data
│   ├── messageStore.ts  # Messages by thread
│   ├── chatStore.ts     # Active thread & DMs
│   └── index.ts         # Exports all stores
│
├── composables/         # Vue composables for business logic
│   ├── useChat.ts       # Main chat functionality
│   ├── useCommands.ts   # Slash command handling
│   └── index.ts         # Exports all composables
│
└── components/          # Vue components
    ├── chat-container/
    │   ├── ChatContainer.vue  # Main container + initialization
    │   ├── chat/
    │   │   └── Chat.vue       # Main chat view
    │   ├── sidebar/
    │   │   └── Sidebar.vue    # Channel/DM list sidebar
    │   └── header/
    │       └── ChatHeader.vue # Header component
    └── ...
```

## Layer Descriptions

### 1. Models (`src/models/`)

**Purpose:** Define TypeScript interfaces and types for data structures.

**Key files:**
- `User.ts` - User interface with id, name, email, avatar, status
- `Message.ts` - Message interface with sender, text, timestamps
- `Channel.ts` - Channel interface with members, privacy settings
- `DirectMessage.ts` - DM interface linking to a user
- `index.ts` - Exports Thread type and all models

**Usage:**
```typescript
import type { User, Channel, Message } from 'src/models'
```

### 2. Services (`src/services/`)

**Purpose:** Handle all data fetching and API calls. Currently uses mock data.

**Structure:**
- `mock/mockData.ts` - Contains all mock data (users, channels, messages, DMs)
- `api/*Service.ts` - Service files that simulate API calls with delays

**Key services:**
- `userService` - getCurrentUser, getAllUsers, updateStatus, getDirectMessages
- `channelService` - getMyChannels, createChannel, inviteUser, removeUser
- `messageService` - getMessages, sendMessage, editMessage, deleteMessage

**Usage:**
```typescript
import { userService, channelService, messageService } from 'src/services/api'

const users = await userService.getAllUsers()
const channels = await channelService.getMyChannels()
```

**Migration to real backend:**
When implementing a real backend, you only need to:
1. Replace the service implementations to call actual API endpoints
2. Remove the mock data imports
3. Keep the same interface - no changes needed elsewhere!

### 3. Stores (`src/stores/`)

**Purpose:** Manage application state using Pinia.

**Key stores:**
- `authStore` - Current user, authentication status
- `userStore` - Map of all users by ID
- `channelStore` - Map of channels, create/join/leave operations
- `messageStore` - Messages organized by thread
- `chatStore` - Active thread, DM list

**Usage in components:**
```typescript
import { useAuthStore, useChannelStore } from 'src/stores'

const authStore = useAuthStore()
const channelStore = useChannelStore()

// Access state
console.log(authStore.currentUser)
console.log(channelStore.channelList)

// Call actions
await channelStore.fetchMyChannels()
```

**Why Pinia?**
- Type-safe with TypeScript
- DevTools support
- Simple, intuitive API
- No mutations needed (unlike Vuex)

### 4. Composables (`src/composables/`)

**Purpose:** Provide reusable business logic and orchestrate stores.

**Key composables:**
- `useChat()` - Main chat functionality
  - Combines data from multiple stores
  - Provides computed properties (channels, messages, directMessages)
  - Exposes actions (sendMessage, createChannel, openChannel)
  - Handles initialization

- `useCommands()` - Slash command handling
  - Parses and executes slash commands (/join, /invite, /kick, etc.)
  - Accesses stores directly (to avoid circular dependencies)
  - Returns success/error results

**Usage in components:**
```typescript
import { useChat, useCommands } from 'src/composables'

const chat = useChat()
const commands = useCommands()

// Access data
console.log(chat.channels.value)
console.log(chat.activeMessages.value)

// Perform actions
await chat.sendMessage('Hello!')
await commands.handleCommand('/join general')
```

**Why composables?**
- Component logic stays simple
- Easy to test business logic separately
- Reusable across multiple components
- Type-safe with TypeScript

### 5. Components (`src/components/`)

**Purpose:** Render UI and handle user interactions.

**Key components:**
- `ChatContainer.vue` - Initializes the chat (calls `chat.initialize()`)
- `Chat.vue` - Displays messages and input, handles sending
- `Sidebar.vue` - Shows channels and DMs
- `UserBar.vue` - User status and settings

**Component responsibilities:**
- Import composables (not stores directly!)
- Bind data to template
- Handle user events
- Show notifications

**Example:**
```vue
<script setup lang="ts">
import { useChat } from 'src/composables'
import { Notify } from 'quasar'

const chat = useChat()

async function handleSend(text: string) {
  try {
    await chat.sendMessage(text)
  } catch (error) {
    Notify.create({ message: 'Failed to send', color: 'negative' })
  }
}
</script>

<template>
  <div>
    <div v-for="msg in chat.activeMessages.value" :key="msg.id">
      {{ msg.text }}
    </div>
    <input @keyup.enter="handleSend($event.target.value)" />
  </div>
</template>
```

## Data Flow

### Reading data:
```
Component → Composable → Store → (reads from memory)
```

### Writing data:
```
Component → Composable → Store → Service → (updates mock/API)
                           ↓
                       (updates store)
```

## Key Principles

1. **One-way data flow**: Data flows down, events flow up
2. **Single source of truth**: Stores hold the authoritative data
3. **Composables for logic**: Keep components focused on rendering
4. **Services for I/O**: All external data access goes through services
5. **Type safety**: TypeScript everywhere

## Common Patterns

### Initializing the app
```typescript
// In ChatContainer.vue
onMounted(async () => {
  await chat.initialize()
})
```

### Opening a channel
```typescript
// In Sidebar.vue
async function handleOpenChannel(ch: { id: string }) {
  await chat.openChannel(ch.id)
}
```

### Sending a message
```typescript
// In Chat.vue
async function handleSend(text: string) {
  if (text.startsWith('/')) {
    await commands.handleCommand(text)
  } else {
    await chat.sendMessage(text)
  }
}
```

### Handling errors
```typescript
try {
  await chat.createChannel({ name: 'new-channel', isPrivate: false })
} catch (error) {
  Notify.create({ message: 'Failed to create channel', color: 'negative' })
}
```

## Benefits of this Architecture

1. **Easy to test**: Each layer can be tested independently
2. **Easy to modify**: Change one layer without affecting others
3. **Easy to scale**: Add new features following the same patterns
4. **Easy backend integration**: Just update the service layer
5. **Type-safe**: TypeScript catches errors at compile time
6. **Maintainable**: Clear separation of concerns

## Migration to Real Backend

When you're ready to connect to a real backend:

1. **Update services** (`src/services/api/*Service.ts`):
   ```typescript
   // Before (mock):
   export const userService = {
     async getAllUsers() {
       await delay(100)
       return mockUsers
     }
   }
   
   // After (real API):
   export const userService = {
     async getAllUsers() {
       const response = await fetch('/api/users')
       return response.json()
     }
   }
   ```

2. **Keep everything else unchanged!**
   - Models stay the same
   - Stores stay the same
   - Composables stay the same
   - Components stay the same

3. **Add error handling and loading states as needed**

## Next Steps

- Add WebSocket support for real-time updates
- Implement authentication flow
- Add file upload functionality
- Add message reactions and threads
- Implement search functionality

## Questions?

If you need to add a new feature:
1. Define the data structure in `models/`
2. Create the service in `services/api/`
3. Create or update the store in `stores/`
4. Expose functionality via composable in `composables/`
5. Use in components!

