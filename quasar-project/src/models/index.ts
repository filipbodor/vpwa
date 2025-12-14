export * from './User'
export * from './Message'
export * from './Channel'

export type ThreadType = 'channel'

export interface Thread {
  type: ThreadType
  id: string
}

