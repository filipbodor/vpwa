import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async search({ request, response }: HttpContext) {
    const query = request.input('q', '').trim()

    if (!query || query.length < 2) {
      return response.badRequest({
        errors: [{ message: 'Search query must be at least 2 characters' }],
      })
    }

    const users = await User.query()
      .where((builder) => {
        builder
          .whereILike('username', `%${query}%`)
          .orWhereILike('first_name', `%${query}%`)
          .orWhereILike('last_name', `%${query}%`)
      })
      .limit(10)

    return response.ok({
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        avatar: user.avatar,
        status: user.status,
      })),
    })
  }

  async show({ params, response }: HttpContext) {
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        errors: [{ message: 'User not found' }],
      })
    }

    return response.ok({
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        avatar: user.avatar,
        status: user.status,
      },
    })
  }
}

