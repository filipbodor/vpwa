'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class AuthController {
  async register({ request, auth, response }) {
    const { username, email, password } = request.only(['username', 'email', 'password'])
    const user = await User.create({ username, email, password })
    const token = await auth.generate(user)
    return response.created({ user: { id: user.id, username: user.username, email: user.email }, token })
  }

  async login({ request, auth, response }) {
    const { email, password } = request.only(['email', 'password'])
    const token = await auth.attempt(email, password)
    return response.ok({ token })
  }

  async me({ auth, response }) {
    const user = await auth.getUser()
    return response.ok({ user: { id: user.id, username: user.username, email: user.email } })
  }

  async logout({ response }) {
    return response.ok({ ok: true })
  }
}

module.exports = AuthController


