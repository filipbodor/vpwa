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
import transmit from '@adonisjs/transmit/services/main'

const AuthController = () => import('#controllers/auth_controller')
const ChannelsController = () => import('#controllers/channels_controller')
const MessagesController = () => import('#controllers/messages_controller')
const DirectMessagesController = () => import('#controllers/direct_messages_controller')
const UsersController = () => import('#controllers/users_controller')

router.get('/', async () => {
  return {
    hello: 'world',
    version: '1.0.0',
    message: 'Slack 2.0 API',
  }
})

router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])

  router.get('/me', [AuthController, 'me']).use(middleware.auth())
  router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
  router.patch('/status', [AuthController, 'updateStatus']).use(middleware.auth())
}).prefix('/auth')

router.group(() => {
  router.get('/public', [ChannelsController, 'public'])
  router.get('/', [ChannelsController, 'index'])
  router.post('/', [ChannelsController, 'store'])
  router.get('/:id', [ChannelsController, 'show'])
  router.post('/:id/join', [ChannelsController, 'join'])
  router.post('/:id/leave', [ChannelsController, 'leave'])
  router.post('/:id/invite', [ChannelsController, 'invite'])
  router.post('/:id/kick', [ChannelsController, 'kick'])
  router.post('/:id/vote-kick', [ChannelsController, 'voteKick'])
  router.delete('/:id', [ChannelsController, 'destroy'])
  router.post('/:id/clear-invite', [ChannelsController, 'clearInvite'])
  
  router.get('/:channelId/messages', [MessagesController, 'index'])
  router.post('/:channelId/messages', [MessagesController, 'store'])
}).prefix('/channels').use(middleware.auth())

router.group(() => {
  router.delete('/:id', [MessagesController, 'destroy'])
}).prefix('/messages').use(middleware.auth())

router.group(() => {
  router.get('/', [DirectMessagesController, 'index'])
  router.post('/', [DirectMessagesController, 'store'])
  router.get('/:id/messages', [DirectMessagesController, 'messages'])
  router.post('/:id/messages', [DirectMessagesController, 'sendMessage'])
}).prefix('/direct-messages').use(middleware.auth())

router.group(() => {
  router.get('/search', [UsersController, 'search'])
  router.get('/:id', [UsersController, 'show'])
}).prefix('/users').use(middleware.auth())

// WebSocket endpoint for real-time communication
transmit.registerRoutes()
