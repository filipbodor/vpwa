export interface Message {
  id: string
  senderId: string
  text: string
  mentions?: string[]
  createdAt: number
  updatedAt?: number
}

