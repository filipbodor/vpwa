import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Channel from './channel.js'

export default class ChannelBan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare channelId: string

  @column()
  declare userId: string

  @column()
  declare bannedBy: string

  @column()
  declare banType: 'owner' | 'vote'

  @column()
  declare voteCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Channel, {
    foreignKey: 'channelId',
  })
  declare channel: BelongsTo<typeof Channel>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'bannedBy',
  })
  declare banner: BelongsTo<typeof User>
}

