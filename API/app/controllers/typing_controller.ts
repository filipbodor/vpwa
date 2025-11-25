import type { HttpContext } from '@adonisjs/core/http'
import { WebSocketService } from '#services/websocket_service'
import vine from '@vinejs/vine'

const typingValidator = vine.compile(
  vine.object({
    channelId: vine.string().uuid(),
    isTyping: vine.boolean(),
    text: vine.string().optional(),
  })
)

export default class TypingController {
  async broadcastTyping({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { channelId, isTyping, text } = await request.validateUsing(typingValidator)

    await WebSocketService.broadcastTyping(channelId, user.id, user.username, isTyping, text)

    return response.ok({ message: 'Typing status broadcasted' })
  }
}

