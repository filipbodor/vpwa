import vine from '@vinejs/vine'

export const createChannelValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(3)
      .maxLength(100)
      .regex(/^[a-z0-9-]+$/)
      .trim(),
    description: vine.string().maxLength(500).optional(),
    isPrivate: vine.boolean().optional(),
  })
)

export const inviteUserValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid(),
  })
)

export const kickUserValidator = vine.compile(
  vine.object({
    userId: vine.string().uuid(),
  })
)

