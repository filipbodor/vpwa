export type UserStatus = 'online' | 'away' | 'busy' | 'offline'

export interface User {
  id: string
  firstName: string
  lastName: string
  fullName: string
  username: string
  email: string
  avatar?: string
  status: UserStatus
}

