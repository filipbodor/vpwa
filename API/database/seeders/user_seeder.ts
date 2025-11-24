import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'you@example.com',
        firstName: 'Your',
        lastName: 'Name',
        username: 'you',
        password: 'password123',
        avatar: '👤',
        status: 'online',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        username: 'alice_j',
        password: 'password123',
        avatar: '👩',
        status: 'online',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'bob@example.com',
        firstName: 'Bob',
        lastName: 'Smith',
        username: 'bob_smith',
        password: 'password123',
        avatar: '👨',
        status: 'away',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        email: 'carol@example.com',
        firstName: 'Carol',
        lastName: 'White',
        username: 'carol_w',
        password: 'password123',
        avatar: '👩‍💼',
        status: 'busy',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        email: 'diana@example.com',
        firstName: 'Diana',
        lastName: 'Prince',
        username: 'diana_p',
        password: 'password123',
        avatar: '👸',
        status: 'offline',
      },
    ])

    console.log('✅ Users seeded successfully!')
  }
}

