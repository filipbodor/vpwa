export type UserStatus = 'online' | 'dnd' | 'offline'

export interface User {
  id: string
  firstName: string
  lastName: string
  fullName: string
  username: string
  email?: string
  avatar?: string
  status: UserStatus
  mentionsOnly?: boolean // Only receive notifications for @mentions
}

