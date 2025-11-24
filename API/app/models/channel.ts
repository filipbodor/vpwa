import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Message from './message.js'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare isPrivate: boolean

  @column()
  declare ownerId: string

  @column.dateTime()
  declare lastActiveAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,
    pivotColumns: ['is_invited', 'joined_at'],
  })
  declare members: ManyToMany<typeof User>

  @hasMany(() => Message, {
    foreignKey: 'channelId',
  })
  declare messages: HasMany<typeof Message>

  // Check if channel is inactive (30+ days)
  get isInactive(): boolean {
    const thirtyDaysAgo = DateTime.now().minus({ days: 30 })
    return this.lastActiveAt < thirtyDaysAgo
  }
}
