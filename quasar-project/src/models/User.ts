export type UserStatus = 'online' | 'away' | 'busy' | 'offline'

export interface User {
  id: string
  name: string
  username: string
  email?: string
  avatar?: string
  status: UserStatus
}

