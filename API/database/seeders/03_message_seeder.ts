import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Message from '#models/message'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // User IDs
    const userIds = {
      you: '550e8400-e29b-41d4-a716-446655440001',
      alice: '550e8400-e29b-41d4-a716-446655440002',
      bob: '550e8400-e29b-41d4-a716-446655440003',
      carol: '550e8400-e29b-41d4-a716-446655440004',
      diana: '550e8400-e29b-41d4-a716-446655440005',
    }

    // Channel IDs
    const channelIds = {
      general: '550e8400-e29b-41d4-a716-446655440101',
      random: '550e8400-e29b-41d4-a716-446655440102',
      teamAlpha: '550e8400-e29b-41d4-a716-446655440103',
    }


    // Channel messages for #general
    await Message.updateOrCreateMany('id', [
      {
        id: '550e8400-e29b-41d4-a716-446655440301',
        channelId: channelIds.general,
        userId: userIds.alice,
        content: 'Hey everyone! 👋',
        createdAt: DateTime.now().minus({ hours: 1 }),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440302',
        channelId: channelIds.general,
        userId: userIds.you,
        content: 'Hi Alice! How are you?',
        createdAt: DateTime.now().minus({ minutes: 55 }),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440303',
        channelId: channelIds.general,
        userId: userIds.alice,
        content: "I'm doing great! Just finished the new feature.",
        createdAt: DateTime.now().minus({ minutes: 50 }),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440304',
        channelId: channelIds.general,
        userId: userIds.bob,
        content: 'Nice work Alice! 🎉',
        createdAt: DateTime.now().minus({ minutes: 45 }),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440305',
        channelId: channelIds.general,
        userId: userIds.you,
        content: 'Awesome! Can you show us a demo later?',
        createdAt: DateTime.now().minus({ minutes: 40 }),
      },
    ])

    // Channel messages for #random
    await Message.updateOrCreateMany('id', [
      {
        id: '550e8400-e29b-41d4-a716-446655440306',
        channelId: channelIds.random,
        userId: userIds.bob,
        content: 'Anyone up for lunch? 🍕',
        createdAt: DateTime.now().minus({ minutes: 90 }),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440307',
        channelId: channelIds.random,
        userId: userIds.alice,
        content: 'Sure! Where are we going?',
        createdAt: DateTime.now().minus({ minutes: 85 }),
      },
    ])

    // Channel messages for #team-alpha
    await Message.updateOrCreateMany('id', [
      {
        id: '550e8400-e29b-41d4-a716-446655440308',
        channelId: channelIds.teamAlpha,
        userId: userIds.you,
        content: 'This is a private team channel',
        createdAt: DateTime.now().minus({ hours: 2 }),
      },
    ])

    


    console.log('✅ Messages seeded successfully!')
  }
}

