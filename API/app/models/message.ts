import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Channel from './channel.js'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare channelId: string | null

  @column()
  declare directMessageId: string | null

  @column()
  declare userId: string

  @column()
  declare content: string

  @column({
    prepare: (value: string[] | null) => value && value.length > 0 ? JSON.stringify(value) : null,
    consume: (value: any) => {
      if (!value) return []
      if (Array.isArray(value)) return value
      if (typeof value === 'string') {
        if (value === '') return []
        try {
          const parsed = JSON.parse(value)
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      }
      return []
    },
  })
  declare mentions: string[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Channel, {
    foreignKey: 'channelId',
  })
  declare channel: BelongsTo<typeof Channel>

}
