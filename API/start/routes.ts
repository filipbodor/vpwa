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
const ChannelsController = () => import('#controllers/channels_controller')
const MessagesController = () => import('#controllers/messages_controller')
const DirectMessagesController = () => import('#controllers/direct_messages_controller')

// Root route
router.get('/', async () => {
  return {
    hello: 'world',
    version: '1.0.0',
    message: 'Slack 2.0 API',
  }
})

// Auth routes
router.group(() => {
  router.post('/register', [AuthController, 'register'])
  router.post('/login', [AuthController, 'login'])

  // Protected routes
  router.get('/me', [AuthController, 'me']).use(middleware.auth())
  router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
  router.patch('/status', [AuthController, 'updateStatus']).use(middleware.auth())
}).prefix('/auth')

// Channel routes (all protected)
router.group(() => {
  router.get('/public', [ChannelsController, 'public']) // Get all public channels
  router.get('/', [ChannelsController, 'index']) // Get user's channels
  router.post('/', [ChannelsController, 'store']) // Create channel
  router.get('/:id', [ChannelsController, 'show']) // Get channel details
  router.post('/:id/join', [ChannelsController, 'join']) // Join public channel
  router.post('/:id/leave', [ChannelsController, 'leave']) // Leave channel
  router.post('/:id/invite', [ChannelsController, 'invite']) // Invite user
  router.post('/:id/kick', [ChannelsController, 'kick']) // Kick user (owner only)
  router.delete('/:id', [ChannelsController, 'destroy']) // Delete channel (owner only)
  router.post('/:id/clear-invite', [ChannelsController, 'clearInvite']) // Clear invite flag
  
  // Channel messages
  router.get('/:channelId/messages', [MessagesController, 'index']) // Get messages
  router.post('/:channelId/messages', [MessagesController, 'store']) // Send message
}).prefix('/channels').use(middleware.auth())

// Message routes (all protected)
router.group(() => {
  router.delete('/:id', [MessagesController, 'destroy']) // Delete message
}).prefix('/messages').use(middleware.auth())

// Direct Message routes (all protected)
router.group(() => {
  router.get('/', [DirectMessagesController, 'index']) // Get DM conversations
  router.post('/', [DirectMessagesController, 'store']) // Create/get DM
  router.get('/:id/messages', [DirectMessagesController, 'messages']) // Get DM messages
  router.post('/:id/messages', [DirectMessagesController, 'sendMessage']) // Send DM
}).prefix('/direct-messages').use(middleware.auth())