import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Message from './message.js'

export default class DirectMessage extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'user1_id' })
  declare user1Id: string

  @column({ columnName: 'user2_id' })
  declare user2Id: string

  @column.dateTime()
  declare lastMessageAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Relationships
  @belongsTo(() => User, {
    foreignKey: 'user1Id',
  })
  declare user1: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'user2Id',
  })
  declare user2: BelongsTo<typeof User>

  @hasMany(() => Message, {
    foreignKey: 'directMessageId',
  })
  declare messages: HasMany<typeof Message>

  // Helper to get the other user ID
  getOtherUserId(currentUserId: string): string {
    return this.user1Id === currentUserId ? this.user2Id : this.user1Id
  }
}
