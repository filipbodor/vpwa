import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create({
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      password: data.password,
      status: 'offline',
    })

    const token = await User.accessTokens.create(user)

    return response.created({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
      },
      token: token.value!.release(),
    })
  }

  async login({ request, response }: HttpContext) {
    const { emailOrUsername, password } = await request.validateUsing(loginValidator)

    let user: User
    try {
      user = await User.verifyCredentials(emailOrUsername, password)
    } catch (error) {
      const userByUsername = await User.findBy('username', emailOrUsername)
      if (!userByUsername) {
        return response.unauthorized({ errors: [{ message: 'Invalid user credentials' }] })
      }
      user = await User.verifyCredentials(userByUsername.email, password)
    }

    user.status = 'online'
    await user.save()

    const token = await User.accessTokens.create(user)

    return response.ok({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
      },
      token: token.value!.release(),
    })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.user!

    return response.ok({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
      },
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.user!

    user.status = 'offline'
    await user.save()

    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({ message: 'Logged out successfully' })
  }

  async updateStatus({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { status } = request.only(['status'])

    if (!['online', 'dnd', 'offline'].includes(status)) {
      return response.badRequest({ message: 'Invalid status. Must be: online, dnd, or offline' })
    }

    user.status = status
    await user.save()

    return response.ok({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
      },
    })
  }
}

