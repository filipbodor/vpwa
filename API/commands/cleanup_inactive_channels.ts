import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Channel from '#models/channel'
import { DateTime } from 'luxon'

export default class CleanupInactiveChannels extends BaseCommand {
  static commandName = 'channels:cleanup'
  static description = 'Delete channels inactive for more than 30 days'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Starting cleanup of inactive channels...')

    const thirtyDaysAgo = DateTime.now().minus({ days: 30 })

    const inactiveChannels = await Channel.query()
      .where('last_active_at', '<', thirtyDaysAgo.toSQL())
      .preload('members')

    this.logger.info(`Found ${inactiveChannels.length} inactive channels`)

    for (const channel of inactiveChannels) {
      this.logger.info(`Deleting channel: ${channel.name} (inactive since ${channel.lastActiveAt.toFormat('yyyy-MM-dd')})`)
      
      await channel.related('members').detach()
      await channel.delete()
    }

    this.logger.success(`Cleanup completed. Deleted ${inactiveChannels.length} channels.`)
  }
}

