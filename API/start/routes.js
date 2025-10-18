'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

// Auth endpoints (JWT)
Route.post('auth/register', 'AuthController.register')
Route.post('auth/login', 'AuthController.login')
Route.get('auth/me', 'AuthController.me').middleware(['auth'])
Route.post('auth/logout', 'AuthController.logout').middleware(['auth'])

// Protected example
Route.get('protected/ping', ({ response }) => response.json({ pong: true })).middleware(['auth'])

// Channels
Route.get('channels', 'ChannelController.index').middleware(['auth'])
Route.post('channels', 'ChannelController.store').middleware(['auth'])
Route.get('channels/:id', 'ChannelController.show').middleware(['auth'])
Route.post('channels/:id/join', 'ChannelController.join').middleware(['auth'])
Route.post('channels/join-by-name', 'ChannelController.joinByName').middleware(['auth'])

// Messages within a channel
Route.get('channels/:channelId/messages', 'MessageController.index').middleware(['auth'])
Route.post('channels/:channelId/messages', 'MessageController.store').middleware(['auth'])
