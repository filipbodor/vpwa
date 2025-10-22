export interface Channel {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  ownerId: string
  memberIds: string[]
  lastActiveAt: number
}