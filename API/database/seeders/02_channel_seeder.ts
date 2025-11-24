import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Channel from '#models/channel'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Define channel IDs
    const channelIds = {
      general: '550e8400-e29b-41d4-a716-446655440101',
      random: '550e8400-e29b-41d4-a716-446655440102',
      teamAlpha: '550e8400-e29b-41d4-a716-446655440103',
    }

    // User IDs from user seeder
    const userIds = {
      you: '550e8400-e29b-41d4-a716-446655440001',
      alice: '550e8400-e29b-41d4-a716-446655440002',
      bob: '550e8400-e29b-41d4-a716-446655440003',
      carol: '550e8400-e29b-41d4-a716-446655440004',
      diana: '550e8400-e29b-41d4-a716-446655440005',
    }

    // Create channels
    const channels = await Channel.updateOrCreateMany('id', [
      {
        id: channelIds.general,
        name: 'general',
        description: 'General discussion for everyone',
        isPrivate: false,
        ownerId: userIds.you,
        lastActiveAt: DateTime.now().minus({ minutes: 5 }),
      },
      {
        id: channelIds.random,
        name: 'random',
        description: 'Random chat and off-topic discussions',
        isPrivate: false,
        ownerId: userIds.alice,
        lastActiveAt: DateTime.now().minus({ hours: 1 }),
      },
      {
        id: channelIds.teamAlpha,
        name: 'team-alpha',
        description: 'Private channel for Team Alpha members',
        isPrivate: true,
        ownerId: userIds.you,
        lastActiveAt: DateTime.now().minus({ minutes: 30 }),
      },
    ])

    // Attach members to channels
    // General channel - all users
    await channels[0].related('members').sync({
      [userIds.you]: { is_invited: false, joined_at: DateTime.now().minus({ days: 10 }) },
      [userIds.alice]: { is_invited: false, joined_at: DateTime.now().minus({ days: 9 }) },
      [userIds.bob]: { is_invited: false, joined_at: DateTime.now().minus({ days: 8 }) },
      [userIds.carol]: { is_invited: false, joined_at: DateTime.now().minus({ days: 7 }) },
      [userIds.diana]: { is_invited: false, joined_at: DateTime.now().minus({ days: 6 }) },
    })

    // Random channel - you, alice, bob
    await channels[1].related('members').sync({
      [userIds.you]: { is_invited: false, joined_at: DateTime.now().minus({ days: 5 }) },
      [userIds.alice]: { is_invited: false, joined_at: DateTime.now().minus({ days: 5 }) },
      [userIds.bob]: { is_invited: false, joined_at: DateTime.now().minus({ days: 4 }) },
    })

    // Team Alpha (private) - you, alice (alice is newly invited)
    await channels[2].related('members').sync({
      [userIds.you]: { is_invited: false, joined_at: DateTime.now().minus({ days: 3 }) },
      [userIds.alice]: { is_invited: true, joined_at: DateTime.now().minus({ minutes: 10 }) },
    })

    console.log('✅ Channels seeded successfully!')
  }
}
