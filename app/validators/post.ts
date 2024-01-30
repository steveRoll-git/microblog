import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    body: vine.string().trim().maxLength(300).minLength(1),
    parentPostId: vine.number().withoutDecimals().positive().optional(),
  })
)
