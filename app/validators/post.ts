import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    body: vine.string().trim().escape().maxLength(300).minLength(1),
  })
)
