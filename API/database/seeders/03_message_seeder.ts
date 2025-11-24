import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Message from '#models/message'
import DirectMessage from '#models/direct_message'
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

    // Create Direct Message conversations (ensure user1Id < user2Id)
    const dm1 = await DirectMessage.create({
      id: '550e8400-e29b-41d4-a716-446655440201',
      user1Id: userIds.alice < userIds.you ? userIds.alice : userIds.you,
      user2Id: userIds.alice < userIds.you ? userIds.you : userIds.alice,
      lastMessageAt: DateTime.now().minus({ minutes: 10 }),
    })

    const dm2 = await DirectMessage.create({
      id: '550e8400-e29b-41d4-a716-446655440202',
      user1Id: userIds.bob < userIds.you ? userIds.bob : userIds.you,
      user2Id: userIds.bob < userIds.you ? userIds.you : userIds.bob,
      lastMessageAt: DateTime.now().minus({ hours: 2 }),
    })

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

    // Direct messages between you and alice
    await Message.updateOrCreateMany('id', [
      {
        id: '550e8400-e29b-41d4-a716-446655440309',
        directMessageId: dm1.id,
        userId: userIds.alice,
        content: 'Hey! Quick question',
        createdAt: DateTime.now().minus({ minutes: 30 }),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440310',
        directMessageId: dm1.id,
        userId: userIds.you,
        content: 'Sure, what do you need?',
        createdAt: DateTime.now().minus({ minutes: 28 }),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440311',
        directMessageId: dm1.id,
        userId: userIds.alice,
        content: 'Can you review my PR?',
        createdAt: DateTime.now().minus({ minutes: 25 }),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440312',
        directMessageId: dm1.id,
        userId: userIds.you,
        content: 'Of course! Will do.',
        createdAt: DateTime.now().minus({ minutes: 20 }),
      },
    ])

    // Direct messages between you and bob
    await Message.updateOrCreateMany('id', [
      {
        id: '550e8400-e29b-41d4-a716-446655440313',
        directMessageId: dm2.id,
        userId: userIds.bob,
        content: 'Thanks for yesterday!',
        createdAt: DateTime.now().minus({ hours: 2, minutes: 20 }),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440314',
        directMessageId: dm2.id,
        userId: userIds.you,
        content: 'No problem!',
        createdAt: DateTime.now().minus({ hours: 2, minutes: 10 }),
      },
    ])

    console.log('✅ Messages seeded successfully!')
  }
}

