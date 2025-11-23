/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')

router.get('/', async () => {
  return {
    hello: 'world',
    version: '1.0.0',
    message: 'Slack 2.0 API',
  }
})

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])

    router.get('/me', [AuthController, 'me']).use(middleware.auth())
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.patch('/status', [AuthController, 'updateStatus']).use(middleware.auth())
  })
  .prefix('/auth')
