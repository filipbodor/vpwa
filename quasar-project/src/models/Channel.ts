export interface Channel {
  id: string
  name: string
  description?: string | undefined
  isPrivate: boolean
  ownerId: string
  members: string[]
  invited?: boolean | undefined
  lastActiveAt: number
}