export * from './User'
export * from './Message'
export * from './Channel'
export * from './DirectMessage'

export type ThreadType = 'channel' | 'dm'

export interface Thread {
  type: ThreadType
  id: string
}

