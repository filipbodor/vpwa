// Channel.ts
import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, belongsTo, hasMany, afterSave } from '@adonisjs/lucid/orm'
import type { ManyToMany, BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Message from './message.js'
import { WebSocketService } from '#services/websocket_service' // <-- import this


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
  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,
    pivotColumns: ['is_invited', 'joined_at'],
  })
  declare members: ManyToMany<typeof User>

  @hasMany(() => Message, { foreignKey: 'channelId' })
  declare messages: HasMany<typeof Message>

 
  @afterSave()
static async scheduleDeletion(channel: Channel) {
  const delay = 60 * 1000 // 1 minute

  if ((channel as any)._deletionTimeout) {
    clearTimeout((channel as any)._deletionTimeout)
  }

  ;(channel as any)._deletionTimeout = setTimeout(async () => {
    try {
      const freshChannel = await Channel.find(channel.id)
      if (!freshChannel) return

      if (DateTime.now().toMillis() - freshChannel.lastActiveAt.toMillis() >= 60_000) {
        await freshChannel.load('members')
        const memberIds = freshChannel.members.map((m) => m.id)

        await freshChannel.related('members').detach()
        await freshChannel.delete()

        await WebSocketService.broadcastChannelDeleted(freshChannel.id, memberIds)

        console.log(`[ImmediateDeletion] Deleted channel: ${freshChannel.name}`)
      }
    } catch (err) {
      console.error('[ImmediateDeletion] Error deleting channel:', err)
    }
  }, delay)
}
}